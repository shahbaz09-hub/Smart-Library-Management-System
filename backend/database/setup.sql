-- MySQL Database Setup for Smart Library Management System
CREATE DATABASE IF NOT EXISTS library_management_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'library_user'@'localhost' IDENTIFIED BY 'library_password';
GRANT ALL PRIVILEGES ON library_management_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;

USE library_management_db;
SELECT 'Database library_management_db created successfully!' as message;