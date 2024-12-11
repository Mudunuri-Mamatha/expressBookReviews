/*const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if a username is valid
const isValid = (username) => {
    // Check if the username is non-empty and doesn't contain invalid characters
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/; // Only alphanumeric and underscore
    return username && validUsernameRegex.test(username);
};

// Helper function to authenticate a user
const authenticatedUser = (username, password) => {
    // Check if the username and password match the records
    return users.some(user => user.username === username && user.password === password);
};

// Middleware to verify the JWT token for authenticated routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded; // Attach decoded username to the request
      next();
  });
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username is valid
    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username. Use only alphanumeric characters and underscores." });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: `Username '${username}' is already taken` });
    }

    // Add the new user
    users.push({ username, password });
    res.status(200).json({ message: `User '${username}' registered successfully` });
});

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Authenticate user
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });

  res.status(200).json({
      message: "Login successful",
      token
  });
});


// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { username, review } = req.body;

    // Check if the user is authenticated (mock logic)
    if (!username || !review) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found` });
    }

    // Add or update the review
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    res.status(200).json({ message: `Review for book with ISBN '${isbn}' added/updated successfully`, reviews: books[isbn].reviews });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Extract username from the verified token

  // Check if the book exists
  if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ISBN '${isbn}' not found` });
  }

  // Check if the user has a review for this book
  if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({
          message: `Review for book with ISBN '${isbn}' deleted successfully`,
          reviews: books[isbn].reviews
      });
  } else {
      res.status(404).json({ message: `No review found for user '${username}' on book with ISBN '${isbn}'` });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
*/

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Store registered users here

// Middleware to verify the JWT token for authenticated routes
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secretKey", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        req.user = decoded; // Attach decoded username to the request
        next();
    });
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: `Username '${username}' is already taken` });
  }

  users.push({ username, password });
  res.status(200).json({ message: `User '${username}' registered successfully` });
});


// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });

    res.status(200).json({
        message: "Login successful",
        token
    });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Extract username from the verified token
    const { review } = req.body;

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found` });
    }

    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    res.status(200).json({
        message: `Review for book with ISBN '${isbn}' added/updated successfully`,
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN '${isbn}' not found` });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        res.status(200).json({
            message: `Review for book with ISBN '${isbn}' deleted successfully`,
            reviews: books[isbn].reviews
        });
    } else {
        res.status(404).json({ message: `No review found for user '${username}' on book with ISBN '${isbn}'` });
    }
});

module.exports.authenticated = regd_users;
