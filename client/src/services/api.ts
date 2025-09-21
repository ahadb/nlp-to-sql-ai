const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface UploadResponse {
  message: string;
  schema: string;
}

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  data: {
    question: string;
    sql_query: string;
    schema: string;
  };
}

export interface DatabaseResponse {
  database: string;
  file_type?: string;
  available_databases?: {
    sql: string;
    csv: string;
  };
}

export const api = {
  async uploadSchema(file: File): Promise<UploadResponse> {
    // Read file content
    const fileContent = await file.text();
    
    // Determine schema type
    const isCSV = file.name.endsWith('.csv');
    const schemaType = isCSV ? 'CSV_FILE' : 'SQL_SCHEMA';
    
    // Prepare request body for your backend
    const requestBody = {
      file_name: file.name,
      file_content: fileContent,
      schema_type: schemaType,
      description: `Uploaded ${isCSV ? 'CSV' : 'SQL'} file: ${file.name}`
    };

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Upload failed");
    }

    const backendResponse = await response.json();
    
    // Transform backend response to match expected format
    return {
      message: backendResponse.message,
      schema: backendResponse.schema_id || 'unknown'
    };
  },

  async generateSQL(
    question: string,
    schema?: string,
    table?: string
  ): Promise<QueryResponse> {
    // Use AWS generate endpoint from environment variable
    const awsGenerateUrl = import.meta.env.VITE_AWS_GENERATE_URL;

    if (!awsGenerateUrl) {
      throw new Error("AWS generate endpoint not configured");
    }

    // Build dynamic URL with query parameters
    // Parse the base URL to avoid duplicate query parameters
    const baseUrl = new URL(awsGenerateUrl);
    const queryParams = new URLSearchParams(baseUrl.search);

    // Override or add schema and table parameters
    if (schema) queryParams.set("schema", schema);
    if (table) queryParams.set("table", table);

    // Reconstruct the URL with the updated parameters
    baseUrl.search = queryParams.toString();
    const fullUrl = baseUrl.toString();

    console.log("Calling AWS generate endpoint:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to generate SQL");
    }

    const awsResponse = await response.json();

    // Transform AWS response to match existing QueryResponse format
    return {
      data: {
        question,
        sql_query: awsResponse.sql,
        schema: awsResponse.schema_used,
      },
    };
  },

  async runSQL(sql: string, schema?: string): Promise<any> {
    // Use AWS query endpoint from environment variable
    const awsQueryUrl = import.meta.env.VITE_AWS_QUERY_URL;

    if (!awsQueryUrl) {
      throw new Error("AWS query endpoint not configured");
    }

    // Build dynamic URL with schema parameter
    const fullUrl = schema ? `${awsQueryUrl}?schema=${schema}` : awsQueryUrl;

    console.log("Calling AWS query endpoint:", fullUrl, "with SQL:", sql);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to run SQL");
    }

    const awsResponse = await response.json();

    // Transform AWS response to match expected format
    return {
      data: awsResponse.rows || [],
      schema_used: awsResponse.schema_used,
      sql: awsResponse.sql,
      ...awsResponse,
    };
  },

  async getDataSources(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/upload/schemas`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get data sources");
    }

    return response.json();
  },

  async getTables(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get tables");
    }

    return response.json();
  },

  async getCurrentDatabase(): Promise<DatabaseResponse> {
    const response = await fetch(`${API_BASE_URL}/current-database`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get current database");
    }

    return response.json();
  },

  async getSchemaDetails(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/debug/schema-details`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get schema details");
    }

    return response.json();
  },

  async getTableData(tableName: string, schemaName: string, limit: number = 5): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/tables/${tableName}/data?schema=${schemaName}&limit=${limit}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get table data");
    }

    return response.json();
  },
};
