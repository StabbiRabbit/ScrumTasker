const { v4: uuidv4 } = require('uuid');
const db = require("../db.js");

const cookieController = {};

/**
 * setSSIDCookie - store the user id in a cookie
 */
cookieController.setSSIDCookie = async (req, res, next) => {
  const ssidString = uuidv4();
  res.cookie("ssid", ssidString, { maxAge: 60 * 1000, httpOnly: true });
  return next();
};

module.exports = cookieController;
