require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const userController = require("./controllers/userController");
const cookieController = require("./controllers/cookieController");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { BACKEND_PORT } = process.env;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  return res.status(202).sendFile(path.join(__dirname, "../build/index.html"));
});

app.post(
  "/signup",
  userController.validateUsername,
  userController.createUser,
  cookieController.setSSIDCookie,
  (req, res) => {
    if (res.locals.createdUser === true) {
      res.status(200).json({
        username: res.locals.username,
        boards: [],
      });
    } else {
      res.status(501).send("Error Signing up");
    }
  }
);

app.get(
  "/dashboard",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  userController.getAllBoardsFromUser,
  (req, res) => {
    if (res.locals.ssidIsValid) res.status(200).json(res.locals.boardInfo);
    else res.status(501).sendStatus("Invalid SSID");
  }
);

app.get("/login", cookieController.validateSSID, (req, res) => {
  if (res.locals.ssidIsValid) res.status(200).json(res.locals.boardInfo);
  else res.status(501).sendStatus("Invalid SSID");
});
// app.post('')

app.post(
  "/login",
  userController.validateUsername,
  userController.validatePassword,
  cookieController.setSSIDCookie,
  (req, res) => {
    if (res.locals.passwordIsValid && res.locals.usernameIsValid) {
      res.status(200).json({
        username: res.locals.username,
        boards: res.locals.boards,
      });
    } else {
      res.status(501).send("Error Logging In, Wrong Username or Password");
    }
  }
);

app.get("/login", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

// app.get("/home", (req, res) => {
//   return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
// });

// // Going to take query strings
// app.get("/board", (req, res) => {
//   return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
// });

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(`${errorObj.log}: ${errorObj.message.err}`);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(BACKEND_PORT, () => {
  console.log(`Listening on port ${BACKEND_PORT}`);
});

module.exports = app;
