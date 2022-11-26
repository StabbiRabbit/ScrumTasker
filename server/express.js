const express = require("express");
const app = express();
const path = require("path");
const userController = require("./controllers/userController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get("/", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

app.post("/signup", 
  (req, res, next) => {
    console.log('SIGNUP ROUTE');
    next()
  },
  userController.userExists, 
  (req, res, next) => {
    console.log('USER EXISTS:', res.locals.userExists);
    next();
  },
  userController.createUser, 
  (req, res, next) => {
    console.log('CREATED USER');
    next();
  },
(req, res) => {
  if (res.locals.createdUser === true) {
    res.redirect("/home");
  }
  else {
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

app.get("/home", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

// Going to take query strings
app.get("/board", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});
//stretch feature 
// app.get("/teams", (req, res) => {
//   return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
// });


// app.use("/build", express.static(path.join(__dirname, "../build"))); 


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
