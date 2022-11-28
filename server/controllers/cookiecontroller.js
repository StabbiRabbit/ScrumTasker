const { v4: uuidv4 } = require('uuid');
const db = require("../db.js");

const cookieController = {};

cookieController.validateSSID = async (req, res, next) => {
  // Check if the client has an SSID cookie
  if (req.cookies.ssid) {
    // Check with database if this SSID corresponds to a single user, only
    let queryText = "SELECT * FROM sessions WHERE ssid = $1";
    let params = [req.cookies.ssid];
    const dbResponse = await db.query(queryText, params);
    res.locals.ssidIsValid = dbResponse === 1;
    if (res.locals.ssidIsValid)
      console.log("SSID IS VALID");
  }
  return next();
}

cookieController.setSSIDCookie = async (req, res, next) => {
  // Generate a random UUID to serve as unique SSID; this will overwrite the client-side SSID cookie if it exists
  const ssidString = uuidv4();
  if (res.locals.passwordIsValid && res.locals.usernameIsValid) {
    const maxAge = 1000 * 60 * 10; // 10 minutes
    res.cookie("ssid", ssidString, { maxAge, httpOnly: true });
  }
  // Get the user_id corresponding to req.body.username inside the database
  const { username } = req.body;
  let queryText = "SELECT _id FROM users WHERE username = $1"
  let params = [username];
  let dbResponse = await db.query(queryText, params);
  // Store the new session inside the database
  const user_id = dbResponse.rows[0]._id;
  queryText = "INSERT INTO sessions (ssid, user_id) VALUES ($1, $2)"
  params = [ssidString, user_id];
  await db.query(queryText, params);
  return next();
};

module.exports = cookieController;
