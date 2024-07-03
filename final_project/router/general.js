const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password)
    return res.send("You must provide user information");

  filtred_user = users.filter((user) => {
    return user.username === username;
  })

  if (filtred_user.length > 0)
    return res.send("User " +  username  + " exist"); 

  users.push({"username": username, "password": password})

  res.send("User " + username + " added successfuly")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {  
  let matched_books = [];

  for (let book in books)
    if (books[book].author === req.params.author)
         matched_books.push(books[book]);    

  if (matched_books.length > 0)
      return res.send(matched_books);
  
  res.send("Author not found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let matched_books = [];

  for (let book in books)
    if (books[book].title === req.params.title)
         matched_books.push(books[book]);    

  if (matched_books.length > 0)
      return res.send(matched_books);
  
  res.send("Title not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
