import { type QueryHistoryItem } from "../types/query";

export const mockQueryHistory: QueryHistoryItem[] = [
  {
    id: "1",
    question: "Show me all products with price greater than $20",
    sql: "SELECT * FROM products WHERE unit_price > 20",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: "success",
    results: [
      { product_id: 1, product_name: "Chai", unit_price: 18.0 },
      { product_id: 2, product_name: "Chang", unit_price: 19.0 },
    ],
  },
  {
    id: "2",
    question: "How many customers do we have?",
    sql: "SELECT COUNT(*) as customer_count FROM customers",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: "success",
    results: [{ customer_count: 91 }],
  },
  {
    id: "3",
    question: "Find orders from last month",
    sql: "SELECT * FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL '1 month'",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "error",
  },
  {
    id: "4",
    question: "Show top 5 products by sales",
    sql: "SELECT p.product_name, SUM(od.quantity) as total_sales FROM products p JOIN order_details od ON p.product_id = od.product_id GROUP BY p.product_id ORDER BY total_sales DESC LIMIT 5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "success",
    results: [
      { product_name: "Chai", total_sales: 150 },
      { product_name: "Chang", total_sales: 120 },
      { product_name: "Aniseed Syrup", total_sales: 100 },
    ],
  },
  {
    id: "5",
    question: "What is the average order value?",
    sql: "SELECT AVG(order_total) as avg_order_value FROM (SELECT SUM(unit_price * quantity) as order_total FROM order_details GROUP BY order_id)",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    status: "success",
    results: [{ avg_order_value: 830.75 }],
  },
];
