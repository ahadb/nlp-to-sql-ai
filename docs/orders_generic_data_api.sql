-- Generic SQL for Data API (no transactions, no schema qualifiers)
DROP TABLE IF EXISTS data_table CASCADE;

CREATE TABLE data_table (
  "orderid"      TEXT,
  "orderdate"    TEXT,
  "customername" TEXT,
  "product"      TEXT,
  "quantity"     TEXT,
  "unitprice"    TEXT,
  "total"        TEXT
);

INSERT INTO data_table ("orderid","orderdate","customername","product","quantity","unitprice","total") VALUES
('1001','2025-08-01','Ahad Bokhari','Laptop','1','1200.0','1200.0'),
('1002','2025-08-02','Zoya Khan','Smartphone','2','800.0','1600.0');
