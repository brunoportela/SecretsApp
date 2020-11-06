const express = require('express');
const ejs = require('ejs');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});



//Setup port and listen...
const port = process.env.PORT;
const localhost = 3000;
app.listen(port || localhost, function (){
  console.log("connected");
});
