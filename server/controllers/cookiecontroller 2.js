const User = require("../models/userModel");
const { uuid } = require("uuidv4");

const cookieController = {};

/**
 * setCookie - set a cookie with a random number
 */
cookieController.setCookie = (req, res, next) => {
  // write code here

  // invoke res.cookie method, args: 'codesmith', 'hi'
  res.cookie("codesmith", "hi");
  // invoke res.cookie again, args: 'secret', string result of random num between 1 and 99
  const randomNumString = Math.floor(Math.random() * 100).toString();
  res.cookie("secret", randomNumString);

  // return invocation of next
  return next();
};

/**
 * setSSIDCookie - store the user id in a cookie
 */
cookieController.setSSIDCookie = async (req, res, next) => {
  // write code here
  // indicate this method is async in it's declaration
  // declare constant foundUser and assign it w/ await keyword the eval result of user.findOne passing in args req.body
  console.log("made it to setSSID cookie");
  // const foundUser = await User.findOne(req.body);
  // invoke res.cookie method and pass in args 'ssid', 'foundUser._id
  // third arg obj -< {key httpOnly and the value is true}
  res.cookie("ssid", res.locals.newUserDb._id.id, { httpOnly: true });
  // assign res.locals.ssid to foundUser._id
  // res.locals.ssid = foundUser._id;
  console.log("cookie set!");
  // console.log('res object', res.client.cookies);
  // return invocation of next
  return next();
};

module.exports = cookieController;
