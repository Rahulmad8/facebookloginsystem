const express = require("express");
const passport = require("passport");
const strategy = require("passport-facebook").strategy;

// configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: "348999262315766",
      clientSecret: "81897a373bce765e8ecacb1d295dba92",
      callbackURL: "http://localhost:3000/login/facebook/return"
    },
    function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);
// serialize
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.serializeUser((obj, cb) => {
  cb(null, obj);
});

const app = express();
// set views
app.set("views", __dirname + "/views");
app.set("view  engine", "ejs");

app.use(require("morgan")("combined"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "RM app",
    resave: true,
    saveUninitialized: true
  })
);

// route  -  get  /
// desc: a route to homepage
// access: public

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});
// route  -  get  /login
// desc: a route to login
// access: public
app.get("/login", (req, res) => {
  res.render("login");
});
// route  -  get  /login/facebook
// desc: a route to facebook auth
// access: public
app.get("/login/facebook", passport.authenticate("facebook"));
app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// route  -  get  /profile
// desc: a route to profile
// access: private
app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  (req, res) => {
    res.render("/profile", { user: req.user });
  }
);
app.listen("3000");
