const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the list of books using Promise callbacks
public_users.get('/promise', (req, res) => {
  new Promise((resolve, reject) => {
      resolve(books);
  })
      .then(data => res.status(200).json(data))
      .catch(err => res.status(500).json({ message: "Error fetching books", error: err.message }));
});

// Get the list of books using async/await with Axios
public_users.get('/async', async (req, res) => {
  try {
      // Simulate an API call using Axios
      const response = await axios.get('http://localhost:5000'); // Simulated self-API call
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get the list of books
public_users.get('/', function (req, res) {
  try {
      res.status(200).json(books); // Return the books database as JSON
  } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching books", error: error.message });
  }
});

// Get book details by ISBN using Promises
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
          resolve(book);
      } else {
          reject({ message: `Book with ISBN '${isbn}' not found` });
      }
  })
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json(err));
});

// Get book details by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
      const isbn = req.params.isbn;

      // Simulate an API call using Axios
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Simulated API call
      res.status(200).json(response.data);
  } catch (error) {
      res.status(404).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  const book = books[isbn]; // Find the book by ISBN

  if (book) {
      res.status(200).json(book); // Return the book details
  } else {
      res.status(404).json({ message: `Book with ISBN ${isbn} not found` }); // Return an error if not found
  }
});


// Get book details by author using Promises
public_users.get('/promise/author/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(book => book.author === author);
      if (matchingBooks.length > 0) {
          resolve(matchingBooks);
      } else {
          reject({ message: `No books found for author '${author}'` });
      }
  })
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json(err));
});

// Get book details by author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
      const author = req.params.author;

      // Simulate an API call using Axios
      const response = await axios.get(`http://localhost:5000/author/${author}`); // Simulated API call
      res.status(200).json(response.data);
  } catch (error) {
      res.status(404).json({ message: "Error fetching books by author", error: error.message });
  }
});



// Get book details by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Extract the author from request parameters
  const booksByAuthor = [];

  // Iterate through the books object to find matching authors
  Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
      }
  });

  if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor); // Return all books by the given author
  } else {
      res.status(404).json({ message: `No books found by author: ${author}` }); // Return an error if no books are found
  }
});
  

// Get book details by title using Promises
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(book => book.title === title);
      if (matchingBooks.length > 0) {
          resolve(matchingBooks);
      } else {
          reject({ message: `No books found with the title '${title}'` });
      }
  })
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json(err));
});

// Get book details by title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
      const title = req.params.title;

      // Simulate an API call using Axios
      const response = await axios.get(`http://localhost:5000/title/${title}`); // Simulated API call
      res.status(200).json(response.data);
  } catch (error) {
      res.status(404).json({ message: "Error fetching books by title", error: error.message });
  }
});



// Get book details by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  // Iterate through the books object to find matching titles
  Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
      }
  });

  if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
  } else {
      res.status(404).json({ message: `No books found with title: ${title}` });
  }
});


// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters
  const book = books[isbn]; // Find the book by ISBN

  if (book) {
      res.status(200).json(book.reviews); // Return the reviews of the book
  } else {
      res.status(404).json({ message: `No reviews found for book with ISBN ${isbn}` }); // Return error if not found
  }
});


//  Get book review
//public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
//});

module.exports.general = public_users;
