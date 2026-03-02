# Book Library REST API (v1.0)

This repository contains a basic RESTful API implementation for managing a book library. It is developed using **Node.js**, **Express**, and **MySQL** and is intended as an educational starting point for anyone learning about API development.

## Objective

This project demonstrates the following concepts:

- RESTful HTTP methods (GET, POST, PUT, DELETE)
- Establishing and using a connection to a MySQL database
- Processing JSON request bodies and sending JSON responses
- Basic error handling patterns in Express
- Testing API endpoints using tools such as Postman

## Setup Instructions

The following steps describe the process to set up and run the application.

### 1. Prerequisites

You need to have installed:
- Node.js 
- MySQL 
- Postman 
 for testing

### 2. Create the database

Open MySQL command line or MySQL Workbench and run:

```bash
mysql -u root -p < schema.sql
```

Or manually copy and paste the contents of `schema.sql` into your MySQL client.

This will:
- Create a database called `book_library`
- Create a `books` table
- Add 5 sample books

### 3. Install dependencies

Run the following command to install the required Node.js packages:

```bash
npm install
```

Dependencies include:

- **express** – Web application framework for Node.js
- **mysql2** – MySQL client library providing promise support

### 4. Configure database credentials

By default the server connects as the `root` user with no password. If your MySQL account requires a password, or you prefer to use a different user/host/database, set one or more of the following environment variables before starting the app:

```bash
# Unix/macOS
export DB_USER="youruser"
export DB_PASSWORD="yourpassword"
export DB_HOST="127.0.0.1"
export DB_NAME="book_library"

# Windows PowerShell
$env:DB_USER="youruser"; $env:DB_PASSWORD="yourpassword"; npm start
```

These values are read by `server.js` and fall back to sensible defaults. Alternatively, edit the connection object directly in `server.js`.

### 5. Start the Server

```bash
npm start
```

You should see:
```
 Book Library API running at http://localhost:3000
```

## API Endpoints

The service exposes the following endpoints. Each endpoint returns data in JSON format unless otherwise specified.

### Get All Books
**Request:**
```
GET http://localhost:3000/books
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "year": 1960,
    "genre": "Fiction"
  },
  ...
]
```

### Get a Single Book
**Request:**
```
GET http://localhost:3000/books/1
```

**Response:**
```json
{
  "id": 1,
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "year": 1960,
  "genre": "Fiction"
}
```

### Create a New Book
**Request:**
```
POST http://localhost:3000/books
Content-Type: application/json

{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937,
  "genre": "Fantasy"
}
```

**Response:**
```json
{
  "id": 6,
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937,
  "genre": "Fantasy",
  "message": "Book created successfully"
}
```

### Update a Book
**Request:**
```
PUT http://localhost:3000/books/1
Content-Type: application/json

{
  "genre": "Classic Fiction"
}
```

Only include the fields you want to update!

**Response:**
```json
{
  "message": "Book updated successfully",
  "id": 1
}
```

### Patch a Book (Partial Update)
**Request:**
```
PATCH http://localhost:3000/books/1
Content-Type: application/json

{
  "genre": "Classic Fiction"
}
```

PATCH is semantically identical to PUT for this API – both allow partial updates with any subset of fields.

**Response:**
```json
{
  "message": "Book patched successfully",
  "id": 1
}
```

### Delete a Book
**Request:**
```
DELETE http://localhost:3000/books/1
```

**Response:**
```json
{
  "message": "Book deleted successfully",
  "id": 1
}
```

## Testing with Postman or curl

The API may be exercised using Postman, curl, or any HTTP client capable of sending JSON payloads. The instructions below illustrate usage with Postman; adapt as necessary for other tools.

1. Open Postman
2. Create requests using the endpoints above
3. For POST/PUT requests:
   - Set method to POST/PUT
   - Go to "Body" tab
   - Select "raw" and "JSON"
   - Paste your JSON data

### Example Postman Test

1. **Create a book:**
   - Method: POST
   - URL: `http://localhost:3000/books`
   - Body:
     ```json
     {
       "title": "Dune",
       "author": "Frank Herbert",
       "year": 1965,
       "genre": "Science Fiction"
     }
     ```

2. **Get all books:**
   - Method: GET
   - URL: `http://localhost:3000/books`

3. **Update that book:**
   - Method: PUT
   - URL: `http://localhost:3000/books/6`
   - Body:
     ```json
     {
       "genre": "Sci-Fi"
     }
     ```

4. **Delete it:**
   - Method: DELETE
   - URL: `http://localhost:3000/books/6`

## Code Overview

### `server.js` Structure

**Database Connection (line ~20-30)**
```javascript
const pool = mysql.createPool({...})
```
This creates a connection pool so your app can talk to MySQL.

**Routes (line ~40+)**
- Each `app.get()`, `app.post()`, etc. handles one type of request
- They all follow the same pattern:
  1. Get data from request
  2. Query the database
  3. Send response back

**Error Handling**
```javascript
try {
  // Try to do something
} catch (error) {
  // If it fails, send error response
}
```

## Next Steps and Challenges

### Challenge 1: Add a "search" endpoint
```
GET /books?author=Harper
```

### Challenge 2: Add book quantity tracking
Modify the `books` table to include a `quantity` column

### Challenge 3: Add error validation
Check if book data is valid before saving

## Common Issues and Troubleshooting

**"Can't connect to MySQL"**
- Verify MySQL server is running
- Confirm connection credentials in `server.js` match your database setup (password may be empty or set via an environment variable)
- Ensure the `book_library` database exists

**"Port 3000 already in use"**
- Change `const PORT = 3000` to another number like `3001`

**"Cannot find module 'express'"**
- Run `npm install` again

## Useful Commands

```bash
# Start server
npm start

# View all books in database
mysql -u root -p book_library -e "SELECT * FROM books;"

# Stop server
Ctrl + C

# See what's running on port 3000
netstat -ano | findstr :3000
```

---

Good luck! Remember: understanding this project is more important than memorizing it. 📚
