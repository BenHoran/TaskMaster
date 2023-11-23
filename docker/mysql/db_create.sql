-- Create a new database
CREATE DATABASE IF NOT EXISTS TaskMaster;

-- Switch to the newly created database
USE TaskMaster;

-- Create a new user
CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'qa1qa1';

-- Grant necessary privileges to the user on the database
GRANT ALL PRIVILEGES ON TaskMaster.* TO 'task_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Use the specified database
USE TaskMaster;

-- Create a table called 'users'
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    userpass VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create another table called 'orders'
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    task_name VARCHAR(100) NOT NULL,
    task_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, userpass, email) VALUES ('testuser', 'password', 'testuser@domain.com')