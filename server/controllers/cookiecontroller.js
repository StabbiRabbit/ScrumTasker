const { v4: uuidv4 } = require("uuid");
const db = require("../db.js");

const cookieController = {};

cookieController.setSSIDCookie = async (req, res, next) => {
  // Generate a random UUID to serve as unique SSID; this will overwrite the client-side SSID cookie if it exists
  const ssidString = uuidv4();
  if (res.locals.passwordIsValid && res.locals.usernameIsValid) {
    const maxAge = 1000 * 60 * 10; // 10 minutes
    res.cookie("ssid", ssidString, { maxAge, httpOnly: true });
  }
  // Get the user_id corresponding to req.body.username inside the database
  const { username } = req.body;
  let queryText = "SELECT _id FROM users WHERE username = $1";
  let params = [username];
  let dbResponse = await db.query(queryText, params);
  const user_id = dbResponse.rows[0]._id;
  // Store the new session in the database and associate it with the user
  queryText = "INSERT INTO sessions (ssid, user_id) VALUES ($1, $2)";
  params = [ssidString, user_id];
  await db.query(queryText, params);
  if (res.locals.prevSSID) {
    // Delete the old session from the database, if it exists
    queryText = "DELETE FROM sessions WHERE ssid = $1";
    params = [res.locals.prevSSID];
    await db.query(queryText, params);
  }
  return next();
};

cookieController.validateSSID = async (req, res, next) => {
  // Default
  res.locals.ssidIsValid = false;
  // Check if the client has an SSID cookie
  if (req.cookies.ssid) {
    // Check with database if this SSID corresponds to a single user, only
    let queryText =
      "SELECT sessions.ssid, sessions.user_id, users.username FROM sessions JOIN users ON users._id = sessions.user_id WHERE sessions.ssid = $1;";
    let params = [req.cookies.ssid];
    const dbResponse = await db.query(queryText, params);
    console.log("DB", dbResponse.rows);
    if (dbResponse.rows.length === 1) {
      // Persist user information through res.locals for later middleware
      res.locals.username = dbResponse.rows[0].username
      res.locals.user_id = dbResponse.rows[0].user_id;
      res.locals.ssidIsValid = dbResponse.rows.length === 1 && (("body" in req && "username" in req.body && req.body.username == res.locals.username) || (! "body" in req));
    }
    res.locals.prevSSID = req.cookies.ssid;
  }
  return next();
};

cookieController.blockInvalidSession = (req, res, next) => {
  // If session is invalid, respond with error immediately
  if (res.locals.ssidIsValid === false) {
    return next({
      log: "cookieController.validateSSID",
      status: 500,
      message: {
        err: "Invalid Session",
      },
    });
  }
  return next();
};

module.exports = cookieController;
