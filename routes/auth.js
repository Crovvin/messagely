const User = require("../models/user");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const Router = require("express").Router;
const router = new Router();


router.post("/login", async function (req, res, next) {
  try {
    let {username, password} = req.body;
    if (await User.authenticate(username, password)) {
      let token = jwt.sign({username}, SECRET_KEY);
      User.updateLoginTimestamp(username);
      return res.json({token});
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  }
  catch (err) {
    return next(err);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    let {username} = await User.register(req.body);
    let token = jwt.sign({username}, SECRET_KEY);
    User.updateLoginTimestamp(username);
    return res.json({token});
  }
  catch (err) {
    return next(err);
  }
});



module.exports = router;