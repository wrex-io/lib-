// Book Library REST API
// This server handles all book management endpoints
// We're using Express for the web framework and MySQL for data storage

import express from 'express';
import mysql from 'mysql2/promise';

// Create the Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// ========================
// DATABASE CONNECTION
// ========================
// Create a MySQL connection pool
// A pool allows multiple connections to be reused
// allow credentials to be provided via environment variables for flexibility
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // set this env var if your MySQL user requires a password
  database: process.env.DB_NAME || 'book_library',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




// ========================
// ROUTES
// ========================

// GET all books
// Request: GET /books
// Response: Array of all books in the database
app.get('/books', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [books] = await connection.query('SELECT * FROM books');
    connection.release();
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET a single book by ID
// Request: GET /books/:id
// Response: Single book object
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [books] = await connection.query('SELECT * FROM books WHERE id = ?', [id]);
    connection.release();
    
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(books[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// CREATE a new book
// Request: POST /books
// Body: { title, author, year, genre }
// Response: Created book with ID
app.post('/books', async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    
    // Check if all required fields are provided
    if (!title || !author || !year || !genre) {
      return res.status(400).json({ error: 'Missing required fields: title, author, year, genre' });
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO books (title, author, year, genre) VALUES (?, ?, ?, ?)',
      [title, author, year, genre]
    );
    connection.release();
    
    res.status(201).json({
      id: result.insertId,
      title,
      author,
      year,
      genre,
      message: 'Book created successfully'
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// UPDATE a book
// Request: PUT /books/:id
// Body: { title, author, year, genre } (all fields optional)
// Response: Updated book
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (author !== undefined) {
      updates.push('author = ?');
      values.push(author);
    }
    if (year !== undefined) {
      updates.push('year = ?');
      values.push(year);
    }
    if (genre !== undefined) {
      updates.push('genre = ?');
      values.push(genre);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE books SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book updated successfully', id });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// PATCH a book (partial update)
// Request: PATCH /books/:id
// Body: { title, author, year, genre } (all fields optional)
// Response: Updated book
app.patch('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (author !== undefined) {
      updates.push('author = ?');
      values.push(author);
    }
    if (year !== undefined) {
      updates.push('year = ?');
      values.push(year);
    }
    if (genre !== undefined) {
      updates.push('genre = ?');
      values.push(genre);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `UPDATE books SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book patched successfully', id });
  } catch (error) {
    console.error('Error patching book:', error);
    res.status(500).json({ error: 'Failed to patch book' });
  }
});

// DELETE a book
// Request: DELETE /books/:id
// Response: Confirmation message
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM books WHERE id = ?', [id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully', id });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});


// START SERVER

app.listen(PORT, () => {
  console.log(`\n Book Library API running at http://localhost:${PORT}`);
});
