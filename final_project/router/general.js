const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });

    } else {

      return res.status(404).json({
        message: "User already exists!"
      });
    }
  }

  return res.status(404).json({
    message: "Unable to register user."
  });
});


// Task 1 - Get all books
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books));
});


// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.send(books[isbn]);
});


// Task 3 - Get books by author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let matchingBooks = {};

  Object.keys(books).forEach((key) => {

    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }

  });

  return res.send(JSON.stringify(matchingBooks));
});


// Task 4 - Get books by title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let matchingBooks = {};

  Object.keys(books).forEach((key) => {

    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }

  });

  return res.send(JSON.stringify(matchingBooks));
});


// Task 5 - Get reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});


// Task 10 - Get all books using async/await and Axios
async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');

    if (response.status === 200 && response.data) {
      return response.data;
    }

    return {
      message: "No books found"
    };

  } catch (error) {
    return {
      message: "Error retrieving books",
      error: error.message
    };
  }
}


// Task 11 - Get book by ISBN using Promises and Axios
function getBookByISBNAsync(isbn) {
  return axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {

      if (response.status === 200 && response.data) {
        return response.data;
      }

      return {
        message: "Book not found"
      };
    })
    .catch((error) => {

      if (error.response && error.response.status === 404) {
        return {
          message: "Book not found"
        };
      }

      return {
        message: "Error retrieving book by ISBN",
        error: error.message
      };
    });
}


// Task 12 - Get books by author using async/await and Axios
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    if (
      response.status === 200 &&
      response.data &&
      Object.keys(response.data).length > 0
    ) {
      return response.data;
    }

    return {
      message: "No books found for this author"
    };

  } catch (error) {

    if (error.response && error.response.status === 404) {
      return {
        message: "No books found for this author"
      };
    }

    return {
      message: "Error retrieving books by author",
      error: error.message
    };
  }
}


// Task 13 - Get books by title using async/await and Axios
async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    if (
      response.status === 200 &&
      response.data &&
      Object.keys(response.data).length > 0
    ) {
      return response.data;
    }

    return {
      message: "No books found with this title"
    };

  } catch (error) {

    if (error.response && error.response.status === 404) {
      return {
        message: "No books found with this title"
      };
    }

    return {
      message: "Error retrieving books by title",
      error: error.message
    };
  }
  
}module.exports.general = public_users;
