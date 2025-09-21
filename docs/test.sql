-- Test with sample SQL file
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY, 
    customer_id INTEGER REFERENCES customers(id),
    total DECIMAL(10,2)
);