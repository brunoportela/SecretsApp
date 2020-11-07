require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

//Setup database
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//Use mongoose-encryption
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.route("/login")
  //GET REQUEST
  .get(function(req, res) {
    res.render("login");
  })
  //POST REQUEST
  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser) {
      if(err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });

app.route("/register")
  //GET REQUEST
  .get(function(req, res) {
    res.render("register");
  })
  //POST REQUEST
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });


//Setup port and listen...
const port = process.env.PORT;
const localhost = 3000;
app.listen(port || localhost, function() {
  console.log("connected");
});
