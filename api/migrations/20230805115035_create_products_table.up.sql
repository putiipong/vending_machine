-- db/migrations/123456_create_products_table.up.sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL
);

INSERT INTO products (name, price,quantity) VALUES
  ('Snack', 20,10),
  ('Chips', 10,200),
  ('Water', 250,150),
  ('Toy', 1000,9),
  ('Candy', 5,2);