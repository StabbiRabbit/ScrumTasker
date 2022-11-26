const db = require("../db.js");
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");

const userController = {};

// userController.getAllUsers = (req, res, next) => {};

userController.createUser = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if the user already exists
  if (res.locals.userExists === true) {
    const err = {
      log: "userController.userExists",
      message: "Username already exists",
    };
    res.locals.createdUser = false;
    return next(err);
  }

  // Create a new user in users table with username and hashedPass inside the callback
  bcrypt.hash(password, SALT_WORK_FACTOR, (err, hashedPass) => {
    if (err) {
      return next(err);
    }
    const queryText = `INSERT INTO users (username, password) VALUES ${username}, ${hashedPass}`;
    console.log("QUERY:", queryText);
    db.query(queryText, (err) => {
      if (err) {
        return next(err);
      }
      res.locals.createdUser = true;
      return next();
    });
  });
};

userController.userExists = (req, res, next) => {
  const { username } = req.body;
  console.log(req.body);
  const queryText = `SELECT * FROM users WHERE username = '${username}'`;
  console.log("QUERY:", queryText);
  db.query(queryText, (err, dbResponse) => {
    if (err) {
      return next(err);
    }
    if (dbResponse.length === 0) {
      console.log(dbResponse)
      console.log(res.locals.userExists);
      res.locals.userExists = false;
    } else res.locals.userExists = true;
    return next();
  });
};

// userController.validateUser = async (req, res, next) => {
//   const { username, password } = req.body;
//   const user = db.query("SELECT * FROM users WHERE");

//   if (user[0] === undefined) {
//     res.locals.signedIn = false;
//     return next();
//   }

// //get the password stored in the database and save it ass hasedPass
// const text = 'SELECT * FROM'

// const comparePass = await bcrypt.compare(password, hasedPass, function(err, isMatch) {
//     if (err) {
//         return callback(err);
//       } else {
//         callback(null, isMatch);
//       }
// })

// };

module.exports = userController;
