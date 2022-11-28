const path = require("path");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const boardsController = require("./controllers/boardsController");
const cookieController = require("./controllers/cookieController");
const userController = require("./controllers/userController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true,
}));
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

app.post(
  "/login",
  cookieController.validateSSID,
  userController.validateUsername,
  userController.validatePassword,
  cookieController.setSSIDCookie,
  userController.getAllBoardsFromUser,
  (req, res) => {
    if (res.locals.ssidIsValid || (res.locals.passwordIsValid && res.locals.usernameIsValid)) {
      res.status(200).json({
        username: res.locals.username,
        boards: res.locals.boards,
      });
    } else {
      res.status(501).send("Wrong Password or Username");
    }
  }
);

app.get("/board/:id", boardsController.getBoardFromUser, (req, res) => {
  return res.status(200).json(res.locals.boardInfo);
});

app.post("/create/board", boardsController.createBoard, (req, res) => {
  return res.status(200).json(res.locals.board_id);
});

app.post("/create/story", boardsController.createStory, (req, res) => {
  return res.status(200).json(res.locals.story_id);
});

app.post("/create/task", boardsController.createTask, (req, res) => {
  return res.status(200).json(res.locals.task_id);
});

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


app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
