const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password required"});
  }
  
  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }
  
  users[username] = {password};
  return res.status(201).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4)); // Pretty print with 4 spaces
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = [];
    
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push({ "isbn": key, ...books[key] });
        }
    }
    
    if (matchingBooks.length > 0) {
        res.send(matchingBooks);
    } else {
        res.status(404).send("No books found by this author");
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = [];
    
    for (let key in books) {
        if (books[key].title.toLowerCase().includes(title.toLowerCase())) {
            matchingBooks.push({ "isbn": key, ...books[key] });
        }
    }
    
    if (matchingBooks.length > 0) {
        res.send(matchingBooks);
    } else {
        res.status(404).send("No books found with this title");
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).send("Book not found");
    }
});

public_users.get('/async/books', async function (req, res) {
    try {
        // Simulating an API call with axios (even though it's local)
        const response = await axios.get('http://localhost:5000/');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book" });
    }
});

// Task 12: Get books by author using async/await
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get books by title using async/await
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;
