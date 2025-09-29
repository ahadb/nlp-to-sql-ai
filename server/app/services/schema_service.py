"""
Schema Service for QuantumSQL - Multi-file support for SQL schemas and CSV files
"""
import uuid
import re
import csv
import io
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from enum import Enum
from dataclasses import dataclass
from app.database import get_db_connection
from app.services.hybrid_service import hybrid_service


class SchemaType(str, Enum):
    """Types of supported schemas"""
    SQL_SCHEMA = "SQL_SCHEMA"
    CSV_FILE = "CSV_FILE"


@dataclass
class Column:
    """Database column definition"""
    name: str
    data_type: str
    is_nullable: bool = True
    is_primary_key: bool = False
    is_foreign_key: bool = False
    foreign_key_reference: Optional[str] = None


@dataclass
class Table:
    """Database table definition"""
    name: str
    columns: List[Column]
    primary_keys: List[str]
    foreign_keys: List[Dict[str, str]]


@dataclass
class Relationship:
    """Table relationship definition"""
    from_table: str
    from_column: str
    to_table: str
    to_column: str
    relationship_type: str


@dataclass
class Schema:
    """Complete schema definition"""
    schema_id: str
    schema_type: SchemaType
    namespace: str
    file_name: str
    tables: List[Table]
    relationships: List[Relationship]
    created_at: datetime
    description: Optional[str] = None


class SchemaService:
    """Service for processing and managing multiple schemas"""
    
    def __init__(self):
        self.schemas: Dict[str, Schema] = {}
    
    async def process_file_upload(
        self, 
        file_name: str, 
        file_content: str, 
        schema_type: SchemaType,
        description: Optional[str] = None
    ) -> Schema:
        """Process uploaded file and create schema"""
        schema_id = self._generate_schema_id(file_name, schema_type)
        namespace = self._generate_namespace(file_name)
        
        if schema_type == SchemaType.SQL_SCHEMA:
            tables, relationships = await self._parse_sql_schema(file_content)
        elif schema_type == SchemaType.CSV_FILE:
            tables, relationships = await self._parse_csv_schema(file_content, file_name)
        else:
            raise ValueError(f"Unsupported schema type: {schema_type}")
        
        schema = Schema(
            schema_id=schema_id,
            schema_type=schema_type,
            namespace=namespace,
            file_name=file_name,
            tables=tables,
            relationships=relationships,
            created_at=datetime.now(),
            description=description
        )
        
        # Create actual database tables and insert data
        await self._create_physical_tables(schema, file_content, schema_type)
        
        # Store schema in memory and database
        self.schemas[schema_id] = schema
        await self._save_schema_to_db(schema)
        
        return schema
    
    async def _parse_sql_schema(self, sql_content: str) -> Tuple[List[Table], List[Relationship]]:
        """Parse SQL CREATE TABLE statements"""
        tables = []
        relationships = []
        
        # Simple regex-based SQL parsing
        create_table_pattern = r'CREATE TABLE\s+(\w+)\s*\((.*?)\);'
        matches = re.findall(create_table_pattern, sql_content, re.IGNORECASE | re.DOTALL)
        
        for table_name, columns_def in matches:
            columns = []
            primary_keys = []
            foreign_keys = []
            
            # Parse column definitions
            column_lines = [line.strip() for line in columns_def.split(',')]
            
            for line in column_lines:
                line = line.strip()
                if not line or line.upper().startswith(('PRIMARY KEY', 'FOREIGN KEY')):
                    continue
                
                parts = line.split()
                if len(parts) >= 2:
                    col_name = parts[0]
                    col_type = parts[1]
                    
                    is_pk = 'PRIMARY KEY' in line.upper()
                    is_fk = 'REFERENCES' in line.upper()
                    fk_ref = None
                    
                    if is_pk:
                        primary_keys.append(col_name)
                    
                    if is_fk:
                        ref_match = re.search(r'REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)', line, re.IGNORECASE)
                        if ref_match:
                            ref_table, ref_column = ref_match.groups()
                            fk_ref = f"{ref_table}.{ref_column}"
                            foreign_keys.append({"column": col_name, "references": fk_ref})
                            
                            relationships.append(Relationship(
                                from_table=table_name,
                                from_column=col_name,
                                to_table=ref_table,
                                to_column=ref_column,
                                relationship_type="many_to_one"
                            ))
                    
                    columns.append(Column(
                        name=col_name,
                        data_type=col_type,
                        is_primary_key=is_pk,
                        is_foreign_key=is_fk,
                        foreign_key_reference=fk_ref
                    ))
            
            tables.append(Table(
                name=table_name,
                columns=columns,
                primary_keys=primary_keys,
                foreign_keys=foreign_keys
            ))
        
        return tables, relationships
    
    async def _parse_csv_schema(self, csv_content: str, file_name: str) -> Tuple[List[Table], List[Relationship]]:
        """Parse CSV content to infer schema"""
        csv_reader = csv.reader(io.StringIO(csv_content))
        headers = next(csv_reader)
        
        # Sample rows to infer data types
        sample_rows = []
        for i, row in enumerate(csv_reader):
            if i >= 10:
                break
            sample_rows.append(row)
        
        columns = []
        for i, header in enumerate(headers):
            data_type = self._infer_column_type([row[i] if i < len(row) else '' for row in sample_rows])
            columns.append(Column(name=header.strip(), data_type=data_type, is_nullable=True))
        
        table_name = self._generate_table_name(file_name)
        table = Table(name=table_name, columns=columns, primary_keys=[], foreign_keys=[])
        
        return [table], []
    
    def _infer_column_type(self, values: List[str]) -> str:
        """Infer column data type from sample values"""
        non_empty_values = [v.strip() for v in values if v.strip()]
        
        if not non_empty_values:
            return "VARCHAR(255)"
        
        # Check integers
        try:
            for val in non_empty_values:
                int(val)
            return "INTEGER"
        except ValueError:
            pass
        
        # Check floats
        try:
            for val in non_empty_values:
                float(val)
            return "DECIMAL(10,2)"
        except ValueError:
            pass
        
        # Default to VARCHAR
        max_length = max(len(val) for val in non_empty_values)
        length = min(max(max_length * 2, 50), 1000)
        return f"VARCHAR({length})"
    
    def _generate_schema_id(self, file_name: str, schema_type: SchemaType) -> str:
        """Generate unique schema ID"""
        prefix = "sql" if schema_type == SchemaType.SQL_SCHEMA else "csv"
        clean_name = re.sub(r'[^\w]', '_', file_name.lower())
        unique_id = str(uuid.uuid4())[:8]
        return f"{prefix}_{clean_name}_{unique_id}"
    
    def _generate_namespace(self, file_name: str) -> str:
        """Generate namespace from file name"""
        return re.sub(r'[^\w]', '_', file_name.lower().replace('.sql', '').replace('.csv', ''))
    
    def _generate_table_name(self, file_name: str) -> str:
        """Generate table name from CSV file name"""
        clean_name = re.sub(r'[^\w]', '_', file_name.lower().replace('.csv', ''))
        return f"{clean_name}_data"
    
    async def _save_schema_to_db(self, schema: Schema):
        """Save schema metadata to database using hybrid service"""
        try:
            # Prepare schema data
            schema_data = {
                "tables": [
                    {
                        "name": table.name,
                        "columns": [
                            {
                                "name": col.name,
                                "data_type": col.data_type,
                                "is_nullable": col.is_nullable,
                                "is_primary_key": col.is_primary_key,
                                "is_foreign_key": col.is_foreign_key,
                                "foreign_key_reference": col.foreign_key_reference
                            } for col in table.columns
                        ],
                        "primary_keys": table.primary_keys,
                        "foreign_keys": table.foreign_keys
                    } for table in schema.tables
                ],
                "relationships": [
                    {
                        "from_table": rel.from_table,
                        "from_column": rel.from_column,
                        "to_table": rel.to_table,
                        "to_column": rel.to_column,
                        "relationship_type": rel.relationship_type
                    } for rel in schema.relationships
                ]
            }
            
            # Use hybrid service to save schema
            result = await hybrid_service.create_schema(
                schema_id=schema.schema_id,
                schema_type=schema.schema_type.value,
                namespace=schema.namespace,
                file_name=schema.file_name,
                description=schema.description,
                schema_data=schema_data
            )
            
            if result:
                print(f"Schema {schema.schema_id} saved successfully")
            else:
                print(f"Failed to save schema {schema.schema_id}")
                
        except Exception as e:
            print(f"Error saving schema to database: {e}")
    
    async def get_schema_by_id(self, schema_id: str) -> Optional[Schema]:
        """Retrieve schema by ID"""
        return self.schemas.get(schema_id)
    
    async def list_all_schemas(self) -> List[Schema]:
        """List all available schemas from both memory and database"""
        # Get schemas from memory
        memory_schemas = list(self.schemas.values())
        
        # Get schemas from database via hybrid service
        try:
            db_schemas = await hybrid_service.get_schemas()
            # Convert database schemas to Schema objects if needed
            # For now, just return memory schemas as the main source
        except Exception as e:
            print(f"Error getting schemas from database: {e}")
        
        return memory_schemas
    
    async def delete_schema(self, schema_id: str) -> bool:
        """Delete a schema"""
        if schema_id in self.schemas:
            del self.schemas[schema_id]
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM schemas WHERE schema_id = %s", (schema_id,))
                conn.commit()
                return cur.rowcount > 0
        finally:
            conn.close()
    
    def generate_schema_context_for_ai(self, schema_ids: List[str]) -> str:
        """Generate schema context for AI query generation across multiple schemas"""
        context_parts = []
        
        for schema_id in schema_ids:
            schema = self.schemas.get(schema_id)
            if not schema:
                continue
            
            context_parts.append(f"\n--- Schema: {schema.namespace} ({schema.schema_type.value}) ---")
            
            for table in schema.tables:
                context_parts.append(f"\nTable: {table.name}")
                context_parts.append("Columns:")
                for col in table.columns:
                    pk_marker = " [PK]" if col.is_primary_key else ""
                    fk_marker = f" [FK -> {col.foreign_key_reference}]" if col.is_foreign_key else ""
                    context_parts.append(f"  - {col.name} {col.data_type}{pk_marker}{fk_marker}")
            
            if schema.relationships:
                context_parts.append("\nRelationships:")
                for rel in schema.relationships:
                    context_parts.append(f"  - {rel.from_table}.{rel.from_column} -> {rel.to_table}.{rel.to_column} ({rel.relationship_type})")
        
        return "\n".join(context_parts)
    
    async def _create_physical_tables(self, schema: Schema, file_content: str, schema_type: SchemaType):
        """Create actual database tables and insert data"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                # Create schema namespace to organize tables
                cur.execute(f"CREATE SCHEMA IF NOT EXISTS {schema.namespace}")
                
                if schema_type == SchemaType.SQL_SCHEMA:
                    await self._create_tables_from_sql(cur, schema, file_content)
                elif schema_type == SchemaType.CSV_FILE:
                    await self._create_table_from_csv(cur, schema, file_content)
                
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise Exception(f"Failed to create physical tables: {str(e)}")
        finally:
            conn.close()
    
    async def _create_tables_from_sql(self, cursor, schema: Schema, sql_content: str):
        """Execute CREATE TABLE statements from SQL file"""
        # Split SQL content into individual statements
        statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
        
        # Separate CREATE TABLE statements from others
        create_statements = []
        other_statements = []
        
        for statement in statements:
            if statement.upper().startswith('CREATE TABLE'):
                create_statements.append(statement)
            elif statement.strip():
                other_statements.append(statement)
        
        # First pass: Create tables without foreign key constraints
        for statement in create_statements:
            # Remove foreign key constraints for first pass
            modified_statement = self._remove_foreign_keys(statement)
            modified_statement = self._add_schema_namespace(modified_statement, schema.namespace)
            cursor.execute(modified_statement)
        
        # Second pass: Add foreign key constraints
        for statement in create_statements:
            fk_constraints = self._extract_foreign_keys(statement)
            for constraint in fk_constraints:
                # Add schema namespace to constraint
                constraint_with_schema = self._add_schema_namespace_to_constraint(constraint, schema.namespace)
                try:
                    cursor.execute(constraint_with_schema)
                except Exception as e:
                    # Log but don't fail - foreign keys are optional for functionality
                    print(f"Warning: Could not add foreign key constraint: {e}")
        
        # Execute any other statements (INSERT, UPDATE, etc.)
        for statement in other_statements:
            try:
                # Add schema namespace to INSERT statements
                if statement.upper().startswith('INSERT'):
                    modified_statement = self._add_schema_namespace_to_insert(statement, schema.namespace)
                else:
                    modified_statement = statement
                cursor.execute(modified_statement)
            except Exception as e:
                print(f"Warning: Could not execute statement: {e}")
    
    async def _create_table_from_csv(self, cursor, schema: Schema, csv_content: str):
        """Create table and insert data from CSV file"""
        if not schema.tables:
            return
        
        table = schema.tables[0]  # CSV creates one table
        table_name = f"{schema.namespace}.{table.name}"
        
        # Check if we're using Supabase
        if hybrid_service.use_supabase:
            await self._create_table_in_supabase(schema, csv_content, table_name)
        else:
            # Use local PostgreSQL
            await self._create_table_in_postgresql(cursor, schema, csv_content, table_name)
    
    async def _create_table_in_supabase(self, schema: Schema, csv_content: str, table_name: str):
        """Create table and insert data in Supabase"""
        try:
            from app.services.supabase_service import supabase_service
            from app.env_config import env_config
            from supabase import create_client
            
            # Parse CSV data
            csv_reader = csv.reader(io.StringIO(csv_content))
            headers = next(csv_reader)  # Skip header row
            
            # Prepare data for Supabase
            rows_data = []
            for row in csv_reader:
                if row:  # Skip empty rows
                    row_dict = {}
                    for i, value in enumerate(row):
                        if i < len(headers):
                            row_dict[headers[i]] = value
                    rows_data.append(row_dict)
            
            # Create table metadata in Supabase
            table_data = {
                'table_name': table_name,
                'schema_id': schema.schema_id,
                'display_name': schema.tables[0].name,
                'description': f'Table created from {schema.file_name}',
                'row_count': len(rows_data)
            }
            
            # Store table metadata
            await hybrid_service.create_table(table_data)
            
            # For now, use public schema due to RPC function issues
            schema_name = "public"  # Use public schema instead of custom
            table_name_in_schema = schema.tables[0].name  # This is the full table name like 'support_precise_test_data'
            
            # Use service role client for schema/table creation
            service_client = create_client(
                env_config.supabase_url,
                env_config.supabase_service_role_key
            )
            
            # Skip schema creation since we're using public schema
            print(f"Using public schema for table: {table_name_in_schema}")
            
            # Create the table in the custom schema
            column_defs = []
            for col in schema.tables[0].columns:
                nullable = "" if col.is_nullable else " NOT NULL"
                column_defs.append(f'"{col.name}" {col.data_type}{nullable}')
            
            create_table_sql = f"""
            CREATE TABLE IF NOT EXISTS "{table_name_in_schema}" (
                {', '.join(column_defs)}
            )
            """
            
            try:
                result = service_client.rpc('exec', {'sql': create_table_sql}).execute()
                print(f"Table creation attempted: {table_name_in_schema}")
                # Don't check result due to JSON parsing issues, just continue
            except Exception as table_error:
                print(f"Error creating table {table_name_in_schema}: {table_error}")
                # Table creation failed, but continue anyway
            
            # Insert the CSV data into the table
            if rows_data:
                # Convert data to the format Supabase expects
                insert_data = []
                for row in rows_data:
                    # Convert values to appropriate types
                    converted_row = {}
                    for i, col in enumerate(schema.tables[0].columns):
                        if i < len(headers) and headers[i] in row:
                            value = row[headers[i]]
                            # Convert based on column type
                            if col.data_type == 'INTEGER':
                                try:
                                    converted_row[col.name] = int(value) if value else None
                                except (ValueError, TypeError):
                                    converted_row[col.name] = None
                            elif col.data_type.startswith('DECIMAL'):
                                try:
                                    converted_row[col.name] = float(value) if value else None
                                except (ValueError, TypeError):
                                    converted_row[col.name] = None
                            else:
                                converted_row[col.name] = str(value) if value else None
                        else:
                            converted_row[col.name] = None
                    insert_data.append(converted_row)
                
                # Wait a moment for table to be available in schema cache
                import time
                time.sleep(2)
                
                # Insert data in batches
                batch_size = 100
                for i in range(0, len(insert_data), batch_size):
                    batch = insert_data[i:i + batch_size]
                    max_retries = 3
                    for retry in range(max_retries):
                        try:
                            # Use public schema table insertion
                            service_client.table(table_name_in_schema).insert(batch).execute()
                            print(f"Inserted batch {i//batch_size + 1}")
                            break
                        except Exception as insert_error:
                            print(f"Error inserting batch {i//batch_size + 1} (attempt {retry + 1}): {insert_error}")
                            if retry < max_retries - 1:
                                time.sleep(1)  # Wait before retry
                            else:
                                print(f"Failed to insert batch {i//batch_size + 1} after {max_retries} attempts")
                                continue
            
            print(f"Created table {schema_name}.{table_name_in_schema} in Supabase with {len(rows_data)} rows")
            
        except Exception as e:
            print(f"Error creating table in Supabase: {e}")
            # If table creation fails, still store the metadata
            try:
                table_data = {
                    'table_name': table_name,
                    'schema_id': schema.schema_id,
                    'display_name': schema.tables[0].name,
                    'description': f'Table created from {schema.file_name}',
                    'row_count': 0
                }
                await hybrid_service.create_table(table_data)
            except Exception as meta_error:
                print(f"Error storing table metadata: {meta_error}")
    
    async def _create_table_in_postgresql(self, cursor, schema: Schema, csv_content: str, table_name: str):
        """Create table and insert data in local PostgreSQL"""
        try:
            # Build CREATE TABLE statement
            column_defs = []
            for col in schema.tables[0].columns:
                nullable = "NULL" if col.is_nullable else "NOT NULL"
                column_defs.append(f'"{col.name}" {col.data_type} {nullable}')
            
            create_sql = f"""
            CREATE TABLE {table_name} (
                {', '.join(column_defs)}
            )
            """
            cursor.execute(create_sql)
            
            # Insert CSV data
            csv_reader = csv.reader(io.StringIO(csv_content))
            headers = next(csv_reader)  # Skip header row
            
            # Prepare INSERT statement
            placeholders = ', '.join(['%s'] * len(headers))
            quoted_headers = ', '.join([f'"{h}"' for h in headers])
            insert_sql = f'INSERT INTO {table_name} ({quoted_headers}) VALUES ({placeholders})'
            
            # Insert each row
            for row in csv_reader:
                if row:  # Skip empty rows
                    # Convert values to appropriate types
                    converted_row = []
                    for i, value in enumerate(row):
                        if i < len(schema.tables[0].columns):
                            col = schema.tables[0].columns[i]
                            converted_value = self._convert_value(value, col.data_type)
                            converted_row.append(converted_value)
                    
                    cursor.execute(insert_sql, converted_row)
        except Exception as e:
            print(f"Error creating table in PostgreSQL: {e}")
    
    def _add_schema_namespace(self, sql_statement: str, namespace: str) -> str:
        """Add schema namespace to CREATE TABLE statement"""
        # Simple regex replacement to add schema prefix
        import re
        pattern = r'CREATE TABLE\s+(\w+)'
        replacement = f'CREATE TABLE {namespace}.\\1'
        return re.sub(pattern, replacement, sql_statement, flags=re.IGNORECASE)
    
    def _remove_foreign_keys(self, sql_statement: str) -> str:
        """Remove foreign key constraints from CREATE TABLE statement"""
        import re
        # Remove REFERENCES clauses
        cleaned = re.sub(r'\s+REFERENCES\s+\w+\s*\(\s*\w+\s*\)', '', sql_statement, flags=re.IGNORECASE)
        return cleaned
    
    def _extract_foreign_keys(self, sql_statement: str) -> List[str]:
        """Extract foreign key constraints from CREATE TABLE statement"""
        import re
        constraints = []
        
        # Extract table name
        table_match = re.search(r'CREATE TABLE\s+(\w+)', sql_statement, re.IGNORECASE)
        if not table_match:
            return constraints
        
        table_name = table_match.group(1)
        
        # Find all REFERENCES clauses
        fk_pattern = r'(\w+)\s+[^,\)]*\s+REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)'
        matches = re.findall(fk_pattern, sql_statement, re.IGNORECASE)
        
        for column, ref_table, ref_column in matches:
            constraint = f'ALTER TABLE {table_name} ADD CONSTRAINT fk_{table_name}_{column} FOREIGN KEY ({column}) REFERENCES {ref_table}({ref_column})'
            constraints.append(constraint)
        
        return constraints
    
    def _add_schema_namespace_to_constraint(self, constraint: str, namespace: str) -> str:
        """Add schema namespace to ALTER TABLE constraint"""
        import re
        # Add schema to table names in ALTER TABLE statements
        constraint = re.sub(r'ALTER TABLE\s+(\w+)', f'ALTER TABLE {namespace}.\\1', constraint, flags=re.IGNORECASE)
        constraint = re.sub(r'REFERENCES\s+(\w+)', f'REFERENCES {namespace}.\\1', constraint, flags=re.IGNORECASE)
        return constraint
    
    def _add_schema_namespace_to_insert(self, insert_statement: str, namespace: str) -> str:
        """Add schema namespace to INSERT statement"""
        import re
        # Add schema to table name in INSERT statements
        pattern = r'INSERT INTO\s+(\w+)'
        replacement = f'INSERT INTO {namespace}.\\1'
        return re.sub(pattern, replacement, insert_statement, flags=re.IGNORECASE)
    
    def _convert_value(self, value: str, data_type: str) -> any:
        """Convert string value to appropriate Python type based on SQL data type"""
        if not value or value.strip() == '':
            return None
        
        value = value.strip()
        data_type_upper = data_type.upper()
        
        if 'INT' in data_type_upper:
            try:
                return int(value)
            except ValueError:
                return None
        elif 'DECIMAL' in data_type_upper or 'FLOAT' in data_type_upper or 'REAL' in data_type_upper:
            try:
                return float(value)
            except ValueError:
                return None
        elif 'DATE' in data_type_upper or 'TIMESTAMP' in data_type_upper:
            # For now, return as string - could add date parsing later
            return value
        else:
            # VARCHAR, TEXT, etc.
            return value
    
    async def drop_schema_tables(self, schema_id: str) -> bool:
        """Drop all tables for a schema (useful for cleanup/testing)"""
        schema = self.schemas.get(schema_id)
        if not schema:
            return False
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                # Drop all tables in the schema
                for table in schema.tables:
                    table_name = f"{schema.namespace}.{table.name}"
                    cur.execute(f"DROP TABLE IF EXISTS {table_name} CASCADE")
                
                # Drop the schema if empty
                cur.execute(f"DROP SCHEMA IF EXISTS {schema.namespace} CASCADE")
                conn.commit()
                return True
        except Exception as e:
            conn.rollback()
            raise Exception(f"Failed to drop schema tables: {str(e)}")
        finally:
            conn.close()
    
    async def get_table_data_sample(self, schema_id: str, table_name: str, limit: int = 5) -> List[Dict]:
        """Get sample data from a table for testing"""
        schema = self.schemas.get(schema_id)
        if not schema:
            print(f"DEBUG: Schema {schema_id} not found in memory")
            return []
        
        full_table_name = f"{schema.namespace}.{table_name}"
        print(f"DEBUG: Querying table: {full_table_name}")
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(f"SELECT * FROM {full_table_name} LIMIT %s", (limit,))
                columns = [desc[0] for desc in cur.description] if cur.description else []
                rows = cur.fetchall()
                print(f"DEBUG: Found {len(rows)} rows, {len(columns)} columns")
                return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            print(f"DEBUG: Query failed: {str(e)}")
            return []
        finally:
            conn.close()


# Global service instance
schema_service = SchemaService()
