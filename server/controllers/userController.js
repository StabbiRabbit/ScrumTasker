const db = require("../db.js");
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");

const userController = {};

userController.createUser = async (req, res, next) => {
  const { username, password } = req.body;
  // Check if the user already exists
  if (res.locals.usernameIsValid === true) {
    const err = {
      log: "userController.createUser",
      status: 500,
      err: {
        message: "Username already exists",
      }
    };
    res.locals.createdUser = false;
    return next(err);
  }
  res.locals.username = username;
  // Create a new user in users table with username and hashedPass inside the callback
  bcrypt.hash(password, SALT_WORK_FACTOR).then((hashedPass) => {
    const queryText = "INSERT INTO users (username, password) VALUES ($1, $2);";
    const values = [username, hashedPass];
    db.query(queryText, values)
      .then((result) => {
        res.locals.createdUser = true;
        return next();
      })
      .catch((err) => {
        next({
          log: "userController.createUser",
          status: 500,
          err: { message: "Error inserting user to database" },
        });
      });
  });
};

userController.validateUsername = (req, res, next) => {
  const { username } = req.body;
  const queryText = `SELECT * FROM users WHERE username = '${username}'`;
  db.query(queryText, []).then((dbResponse) => {
    res.locals.usernameIsValid = dbResponse.rows.length === 0 ? false : true;
    return next();
  });
};

userController.validatePassword = (req, res, next) => {
  if (res.locals.usernameIsValid === false)
    return next({
      log: "userController.validatePassword",
      status: 500,
      err: { message: "Incorrect username or password" },
    });

  const { username, password } = req.body;
  const queryText = "SELECT password FROM users WHERE username = $1";
  const params = [username];
  db.query(queryText, params).then((dbResponse) => {
    if (dbResponse.rows === 0) {
      return next({
        log: "userController.validatePassword",
        status: 500,
        err: { message: "Incorrect username or password" },
      });
    }
    bcrypt.compare(password, dbResponse.rows[0].password, (err, isMatch) => {
      if (err) {
        return next({
          log: "userController.validatePassword",
          status: 500,
          err: { message: "Incorrect username or password" },
        });
      }
      res.locals.passwordIsValid = isMatch ? true : false;
      return next();
    });
  });
};

userController.getAllBoardsFromUser = async (req, res, next) => {
  const { username } = req.body;
  let queryText = "SELECT _id FROM users WHERE username = $1";
  let params = [username];
  let dbResponse = await db.query(queryText, params);
  const userId = dbResponse.rows[0]._id;
  queryText = "SELECT board_id FROM board_to_user WHERE board_id = $1";
  params = [userId];
  dbResponse = await db.query(queryText, params);
  const boardIds = dbResponse.rows;
  const boards = [];
  for (const boardId of boardIds) {
    queryText = "SELECT title, _id AS id FROM board WHERE _id = $1";
    params = [boardId.board_id];
    dbResponse = await db.query(queryText, params);
    boards.push(...dbResponse.rows);
  }
  res.locals.boards = boards;
  res.locals.username = username;
  return next();
};

module.exports = userController;
