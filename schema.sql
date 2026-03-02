-- Create the database
CREATE DATABASE IF NOT EXISTS book_library;
USE book_library;

-- Create the books table
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some sample data (optional)
INSERT INTO books (title, author, year, genre) VALUES
('To Kill a Mockingbird', 'Harper Lee', 1960, 'Fiction'),
('1984', 'George Orwell', 1949, 'Dystopian'),
('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Fiction'),
('Pride and Prejudice', 'Jane Austen', 1813, 'Romance'),
('The Catcher in the Rye', 'J.D. Salinger', 1951, 'Fiction');
