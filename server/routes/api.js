const express = require("express");
const boardsController = require("../controllers/boardsController");
const cookieController = require("../controllers/cookieController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post(
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

router.get(
  "/board/:id",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.getBoardFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.post(
  "/board",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createBoard,
  userController.getAllBoardsFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.post(
  "/story",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createStory,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.post(
  "/task",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.createTask,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.delete(
  "/board",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.deleteBoard,
  userController.getAllBoardsFromUser,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.delete(
  "/story",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.deleteStory,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

router.delete(
  "/task",
  cookieController.validateSSID,
  cookieController.blockInvalidSession,
  boardsController.deleteTask,
  boardsController.getBoardFromUserUsingCache,
  (req, res) => {
    return res.status(200).json(res.locals.boardInfo);
  }
);

//stretch feature
// app.get("/teams", (req, res) => {
//   return res.status(200).sendFile(path.join(__dirname, "../build/bundle.html"));
// });

// app.use("/build", express.static(path.join(__dirname, "../build")));

// app.use((req, res) =>
//   res.status(404).send("Sorry! The page you're looking for doesn't exist")
// );

module.exports = router;
