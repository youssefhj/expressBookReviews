const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.filter(user => user.username === username).length > 0 ;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.filter(user => user.username === username && user.password === password).length > 0 ;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const user = req.query;
  
  if (! user) {
      return res.status(404).json({message: "Body Empty"});
  }

  if (! isValid(user.username)) {
    return res.send("User " + user.username + " is not valid");
  }

  if (! authenticatedUser(user.username, user.password))
    return res.send("User " + user.username + " Are not authenticated.")
  
  let accessToken = jwt.sign({
      data: user
    }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
      accessToken
  }

  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.data.username;

    books[isbn].reviews[username] = review;

    res.send(books[isbn]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data.username;

  delete books[isbn].reviews[username];

  res.send(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
