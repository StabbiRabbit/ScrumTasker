const express = require("express");
const app = express();
const path = require("path");
const userController = require("./controllers/userController");
const boardsController = require("./controllers/boardsController");
const cookieController = require("./controllers/cookieController");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(cookieParser());

const PORT = 3000;

app.get("/", (req, res) => {
  return res.status(202).sendFile(path.join(__dirname, "../build/bundle.html"));
});

app.post(
  "/signup",
  userController.validateUsername,
  userController.createUser,
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

app.get(
  "/board/:id",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.getBoardFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.post(
  "/create/board",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createBoard,
  userController.getAllBoardsFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.post(
  "/create/story",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createStory,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.post(
  "/create/task",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createTask,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.delete(
  "/delete/board",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.deleteBoard,
  userController.getAllBoardsFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.post(
  "/delete/story",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createStory,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.post(
  "/delete/task",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createTask,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

app.get("/login", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

app.get("/home", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});

// Going to take query strings
app.get("/board", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
});
//stretch feature
// app.get("/teams", (req, res) => {
//   return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
// });

// app.use("/build", express.static(path.join(__dirname, "../build")));

// app.use((req, res) =>
//   res.status(404).send("Sorry! The page you're looking for doesn't exist")
// );

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

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
