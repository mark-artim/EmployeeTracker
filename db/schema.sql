DROP DATABASE IF EXISTS emptracker_db;
CREATE DATABASE emptracker_db;
USE emptracker_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Pam", "Halpert", 1, 1), ("Jim", "Halpert", 1, 1), ("Dwight", "Shrute", 1, 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Michael", "Scott", 1);

SELECT * FROM employee;

USE emptracker_db;
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(9,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

USE emptracker_db;
INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 125000, 1), ("Sales Representative", 30000, 2), ("Reception", 20000, 1);

SELECT * FROM role;

USE emptracker_db;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  deptname VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (deptname)
VALUES ("Corporate"), ("Sales"), ("Warehouse");

SELECT * FROM department;

