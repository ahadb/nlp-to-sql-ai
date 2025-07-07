from .base import BaseSeeder

class NorthwindSeeder(BaseSeeder):
    """Seeder for Northwind database sample data"""

    def run(self):
        print("🌱 Starting Northwind database seeding...")

        # Check if tables exist
        if not self.table_exists('categories'):
            print("❌ Categories table does not exist. Please run migrations first.")
            return

        # Seed categories
        self.seed_categories()

        # Seed products
        self.seed_products()

        # Seed customers
        self.seed_customers()

        print("🎉 Northwind seeding completed!")

    def seed_categories(self):
        if not self.table_is_empty('categories'):
            print("⏭️ Categories table not empty, skipping...")
            return

        print("📂 Seeding categories...")

        categories_data = [
            (1, 'Beverages', 'Soft drinks, coffees, teas, beers, and ales'),
            (2, 'Condiments', 'Sweet and savory sauces, relishes, spreads, and seasonings'),
            (3, 'Confections', 'Desserts, candies, and sweet breads'),
            (4, 'Dairy Products', 'Cheeses'),
            (5, 'Grains/Cereals', 'Breads, crackers, pasta, and cereal'),
            (6, 'Meat/Poultry', 'Prepared meats'),
            (7, 'Produce', 'Dried fruit and bean curd'),
            (8, 'Seafood', 'Seaweed and fish')
        ]

        for category_id, category_name, description in categories_data:
            query = """
                INSERT INTO categories (category_id, category_name, description)
                VALUES (%s, %s, %s)
                ON CONFLICT (category_id) DO NOTHING;
            """
            if self.execute(query, (category_id, category_name, description)):
                print(f"  ✅ Added category: {category_name}")
            else:
                print(f"  ❌ Failed to add category: {category_name}")

    def seed_products(self):
        if not self.table_is_empty('products'):
            print("⏭️ Products table not empty, skipping...")
            return

        print("📦 Seeding products...")

        products_data = [
            (1, 'Chai', 1, '10 boxes x 20 bags', 18.00, 39, 0, 10, 0),
            (2, 'Chang', 1, '24 - 12 oz bottles', 19.00, 17, 40, 25, 0),
            (3, 'Aniseed Syrup', 2, '12 - 550 ml bottles', 10.00, 13, 70, 25, 0),
            (4, "Chef Anton's Cajun Seasoning", 2, '48 - 6 oz jars', 22.00, 53, 0, 0, 0),
            (5, "Chef Anton's Gumbo Mix", 2, '36 boxes', 21.35, 0, 0, 0, 1),
            (6, "Grandma's Boysenberry Spread", 3, '12 - 8 oz jars', 25.00, 120, 0, 25, 0),
            (7, "Uncle Bob's Organic Dried Pears", 3, '12 - 1 lb pkgs.', 30.00, 15, 0, 10, 0),
            (8, 'Northwoods Cranberry Sauce', 3, '12 - 12 oz jars', 40.00, 6, 0, 0, 0)
        ]

        for (product_id, product_name, supplier_id, quantity_per_unit,
             unit_price, units_in_stock, units_on_order, reorder_level, discontinued) in products_data:
            query = """
                INSERT INTO products (product_id, product_name, supplier_id, quantity_per_unit, 
                                     unit_price, units_in_stock, units_on_order, reorder_level, discontinued)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (product_id) DO NOTHING;
            """
            if self.execute(query, (product_id, product_name, supplier_id, quantity_per_unit,
                                    unit_price, units_in_stock, units_on_order, reorder_level, discontinued)):
                print(f"  ✅ Added product: {product_name}")
            else:
                print(f"  ❌ Failed to add product: {product_name}")

    def seed_customers(self):
        if not self.table_is_empty('customers'):
            print("⏭️ Customers table not empty, skipping...")
            return

        print("👥 Seeding customers...")

        customers_data = [
            ('ALFKI', 'Alfreds Futterkiste', 'Maria Anders', 'Sales Representative',
             'Obere Str. 57', 'Berlin', None, '12209', 'Germany', '030-0074321', '030-0076545'),
            ('ANATR', 'Ana Trujillo Emparedados y helados', 'Ana Trujillo', 'Owner',
             'Avda. de la Constitución 2222', 'México D.F.', None, '05021', 'Mexico', '(5) 555-4729', '(5) 555-3745'),
            ('ANTON', 'Antonio Moreno Taquería', 'Antonio Moreno', 'Owner',
             'Mataderos  2312', 'México D.F.', None, '05023', 'Mexico', '(5) 555-3932', None),
            ('AROUT', 'Around the Horn', 'Thomas Hardy', 'Sales Representative',
             '120 Hanover Sq.', 'London', None, 'WA1 1DP', 'UK', '(171) 555-7788', '(171) 555-6750')
        ]

        for (customer_id, company_name, contact_name, contact_title, address, city,
             region, postal_code, country, phone, fax) in customers_data:
            query = """
                INSERT INTO customers (customer_id, company_name, contact_name, contact_title,
                                     address, city, region, postal_code, country, phone, fax)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (customer_id) DO NOTHING;
            """
            if self.execute(query, (customer_id, company_name, contact_name, contact_title,
                                    address, city, region, postal_code, country, phone, fax)):
                print(f"  ✅ Added customer: {company_name}")
            else:
                print(f"  ❌ Failed to add customer: {company_name}")