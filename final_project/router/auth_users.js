const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Check whether a username already exists
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

// Check whether username and password match
const authenticatedUser = (username, password) => {
  return users.some((user) =>
    user.username === username && user.password === password
  );
};

// Login
regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username or Password not provided"
    });
  }

  if (authenticatedUser(username, password)) {

    const accessToken = jwt.sign(
      {
        data: password
      },
      "access",
      {
        expiresIn: 60 * 60
      }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in"
    });
  }

  return res.status(208).json({
    message: "Invalid Login. Check username and password"
  });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!review) {
    return res.status(400).json({
      message: "Review not provided"
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully posted",
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (
    books[isbn] &&
    books[isbn].reviews[username]
  ) {

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review successfully deleted"
    });
  }

  return res.status(404).json({
    message: "Review not found"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;