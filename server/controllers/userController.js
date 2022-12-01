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
      message: {
        err: "Username already exists",
      },
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
          message: { err: "Error inserting user to database" },
        });
      });
  });
};

userController.validateUsername = (req, res, next) => {
  const { username } = req.body;
  const queryText = `SELECT * FROM users WHERE username = '${username}'`;
  db.query(queryText, []).then((dbResponse) => {
    res.locals.usernameIsValid = dbResponse.rows.length > 0;
    return next();
  });
};

userController.validatePassword = (req, res, next) => {
  if (res.locals.usernameIsValid === false)
    return next({
      log: "userController.validatePassword",
      status: 500,
      message: { err: "Incorrect username or password" },
    });

  const { username, password } = req.body;
  const queryText = "SELECT password FROM users WHERE username = $1";
  const params = [username];
  db.query(queryText, params).then((dbResponse) => {
    if (dbResponse.rows === 0) {
      return next({
        log: "userController.validatePassword",
        status: 500,
        message: { err: "Incorrect username or password" },
      });
    }
    bcrypt.compare(password, dbResponse.rows[0].password, (err, isMatch) => {
      if (err) {
        return next({
          log: "userController.validatePassword",
          status: 500,
          message: { err: "Incorrect username or password" },
        });
      }
      res.locals.passwordIsValid = isMatch ? true : false;
      return next();
    });
  });
};

userController.getAllBoardsFromUser = async (req, res, next) => {
  queryText = "SELECT board_id FROM board_to_user WHERE user_id = $1";
  params = [res.locals.user_id];
  dbResponse = await db.query(queryText, params);
  const boardIds = dbResponse.rows;
  const boards = [];
  // queryTextByIndex = `SELECT title, index, _id AS id FROM board WHERE _id IN (
  //   SELECT board_id FROM board_to_user WHERE user_id = 1) ORDER BY index ASC;`
  // dbResponse = await db.query(queryTextByIndex);
  for (const boardId of boardIds) {
    queryText = "SELECT title, index, _id AS id FROM board WHERE _id = $1";
    params = [boardId.board_id];
    dbResponse = await db.query(queryText, params);
    boards.push(...dbResponse.rows);
  }
  const compareFunction = (a,b) => {
    if (a.index > b.index) return 1;
    else return -1;
  }
  boards.sort(compareFunction)
  res.locals.boardInfo = {
    username: res.locals.username,
    boards: boards,
  };
  return next();
};

module.exports = userController;
