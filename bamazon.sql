DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toshiba 32LF221U19 32-inch 720p HD Smart LED TV", "electronics", 129.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Acer Aspire E 15, 15.6 Full HD, 8th Gen Intel Core i3-8130U, 6GB RAM Memory, 1TB HDD, 8X DVD, E5-576-392H", "electronics", "380", 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mega Bloks 80-Piece Big Building Bag, Classic", "toys", 14.92, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("VTech Pull and Sing Puppy", "toys", 12.97, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cracking the Coding Interview:", "books", 38, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Algorithm Design Manual", "books", 47.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Effective Java", "books", 27.84, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Incredibles 2", "movies", 22.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Christopher Robin", "movies", 19.99, 100);