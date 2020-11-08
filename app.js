require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongooose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Setup database
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongooose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, (err, user) => {
      return cb(err, user);
    });
  }
));


app.route('/')
  .get((req, res) => {
    res.render("home");
  });


app.route('/auth/google')
  .get(
    passport.authenticate('google', {
      scope: ['profile']
    })
  );


app.route('/auth/google/secrets')
  .get(
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      res.redirect('/secrets');
    });


app.route('/secrets')
  .get((req, res) => {
    User.find({
      'secret': {
        $ne: null
      }
    }, (err, foundUsers) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render('secrets', {
            usersWithSecrets: foundUsers
          });
        }
      }
    });
  });


app.route('/submit')
  .get((req, res) => {
    if (req.isAuthenticated()) {
      res.render('submit');
    } else {
      res.redirect('/login');
    }
  })

  .post((req, res) => {
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          foundUser.secret = submittedSecret;
          foundUser.save(_ => {
            res.redirect('/secrets');
          });
        }
      }
    });
  });


app.route("/login")
  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate('local')(req, res, _ => {
          res.redirect('/secrets');
        })
      }
    });
  });


app.route("/register")
  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {
    User.register({
      username: req.body.username
    }, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate('local')(req, res, _ => {
          res.redirect('/secrets');
        })
      }
    });
  });


app.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });


//Setup port and listen...
const port = process.env.PORT;
const localhost = 3000;
app.listen(port || localhost, () => {
  console.log("connected");
});
