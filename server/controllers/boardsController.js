const db = require("../db.js");

const boardsController = {};

boardsController.getBoardFromUser = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  let queryText = "SELECT story_id FROM story_to_board WHERE board_id = $1";
  let params = [id];
  let dbResponse = await db.query(queryText, params);
  const storyId = dbResponse.rows;
  console.log(storyId);
  const stories = [];

  for (const story of storyId) {
    queryText =
      "SELECT text, completed, _id AS story_id FROM story WHERE _id = $1";
    params = [story.story_id];
    dbResponse = await db.query(queryText, params);
    stories.push(dbResponse.rows[0]);
  }

  for (const storyItem of stories) {
    storyItem.tasks = [];
    queryText = "SELECT task_id FROM task_to_story WHERE story_id = $1";
    params = [storyItem.story_id];
    dbResponse = await db.query(queryText, params);
    let taskIds = dbResponse.rows;

    for (taskItem of taskIds) {
      queryText =
        "SELECT description, status, priority, _id AS task_id FROM task WHERE _id = $1";
      params = [taskItem.task_id];
      dbResponse = await db.query(queryText, params);

      taskItem.desc = dbResponse.rows[0].description;
      taskItem.status = dbResponse.rows[0].status;
      taskItem.priority = dbResponse.rows[0].priority;
    }
    storyItem.tasks = dbResponse.rows;
  }

  queryText = "SELECT title FROM board WHERE _id = $1";
  params = [id];
  dbResponse = await db.query(queryText, params);
  let boardTitle = dbResponse.rows[0].title;

  res.locals.boardInfo = { title: boardTitle, board_id: id, stories: stories };
  return next();
};

boardsController.getBoardFromUserUsingCache = async (req, res, next) => {
  let queryText = "SELECT story_id FROM story_to_board WHERE board_id = $1";
  let params = [res.locals.board_id];
  let dbResponse = await db.query(queryText, params);
  const storyId = dbResponse.rows;
  const stories = [];

  for (const story of storyId) {
    queryText =
      "SELECT text, completed, _id AS story_id FROM story WHERE _id = $1";
    params = [story.story_id];
    dbResponse = await db.query(queryText, params);
    stories.push(dbResponse.rows[0]);
  }

  for (const storyItem of stories) {
    storyItem.tasks = [];
    queryText = "SELECT task_id FROM task_to_story WHERE story_id = $1";
    params = [storyItem.story_id];
    dbResponse = await db.query(queryText, params);
    let taskIds = dbResponse.rows;

    for (taskItem of taskIds) {
      queryText =
        "SELECT description, status, priority, _id AS task_id FROM task WHERE _id = $1";
      params = [taskItem.task_id];
      dbResponse = await db.query(queryText, params);

      taskItem.desc = dbResponse.rows[0].description;
      taskItem.status = dbResponse.rows[0].status;
      taskItem.priority = dbResponse.rows[0].priority;
    }
    storyItem.tasks = dbResponse.rows;
  }

  queryText = "SELECT title FROM board WHERE _id = $1";
  params = [id];
  dbResponse = await db.query(queryText, params);
  let boardTitle = dbResponse.rows[0].title;

  res.locals.boardInfo = { title: boardTitle, board_id: id, stories: stories };
  return next();
};

boardsController.createBoard = async (req, res, next) => {
  try {
    const { title, user_id } = req.body;
    let queryText = "INSERT INTO board (title) VALUES ($1) RETURNING _id";
    let params = [title];
    let dbResponse = await db.query(queryText, params);
    res.locals.board_id = dbResponse.rows[0]._id;

    queryText =
      "INSERT INTO board_to_user (board_id, user_id) VALUES ($1, $2);";
    params = [dbResponse.rows[0]._id, user_id];
    dbResponse = await db.query(queryText, params);

    return next();
  } catch (error) {
    return next({
      log: "Error creating a board",
      status: 500,
      message: { err: "Could not create the board" },
    });
  }
};

boardsController.createStory = async (req, res, next) => {
  try {
    const { text, completed, board_id } = req.body;
    let queryText =
      "INSERT INTO story (text, completed) VALUES ($1, $2) RETURNING _id;";
    let params = [text, completed];
    let dbResponse = await db.query(queryText, params);
    res.locals.story_id = dbResponse.rows[0]._id;
    res.locals.board_id = board_id;

    queryText =
      "INSERT INTO story_to_board (story_id, board_id) VALUES ($1, $2);";
    params = [dbResponse.rows[0]._id, board_id];
    dbResponse = await db.query(queryText, params);

    return next();
  } catch (error) {
    return next({
      log: "Error creating a story",
      status: 500,
      message: { err: "Could not create the story" },
    });
  }
};

boardsController.createTask = async (req, res, next) => {
  try {
    const { description, status, priority, story_id } = req.body;
    let queryText =
      "INSERT INTO task (description, status, priority) VALUES ($1, $2, $3) RETURNING _id;";
    let params = [description, status, priority];
    let dbResponse = await db.query(queryText, params);
    res.locals.task_id = dbResponse.rows[0]._id;

    queryText =
      "INSERT INTO task_to_story (task_id, story_id) VALUES ($1, $2);";
    params = [dbResponse.rows[0]._id, story_id];
    dbResponse = await db.query(queryText, params);

    queryText = "SELECT board_id FROM story_to_board WHERE story_id = $1";
    params = [story_id];
    dbResponse = await db.query(queryText, params);

    res.locals.board_id = dbResponse.rows[0].board_id;

    return next();
  } catch (error) {
    return next({
      log: "Error creating a task",
      status: 500,
      message: { err: "Could not create the task" },
    });
  }
};

boardsController.deleteBoard = async (req, res, next) => {
  try {
    const { board_id } = req.body;
    let queryText = "DELETE FROM board WHERE _id = $1";
    let params = [board_id];
    let dbResponse = await db.query(queryText, params);

    queryText = "DELETE FROM board_to_user WHERE board_id = $1";
    params = [board_id];
    dbResponse = await db.query(queryText, params);

    return next();
  } catch (error) {
    return next({
      log: "Error deleting a board",
      status: 500,
      message: { err: "Could not delete the board" },
    });
  }
};

boardsController.deleteStory = async (req, res, next) => {
  try {
    const { story_id } = req.body;

    let queryText = "SELECT board_id FROM story_to_board WHERE story_id = $1";
    let params = [story_id];
    let dbResponse = await db.query(queryText, params);
    res.locals.board_id = dbResponse.rows[0].board_id;

    queryText = "DELETE FROM story WHERE _id = $1";
    params = [story_id];
    dbResponse = await db.query(queryText, params);

    queryText = "DELETE FROM story_to_board WHERE story_id = $1";
    params = [story_id];
    dbResponse = await db.query(queryText, params);

    return next();
  } catch (error) {
    return next({
      log: "Error deleting a story",
      status: 500,
      message: { err: "Could not delete the story" },
    });
  }
};

boardsController.createTask = async (req, res, next) => {
  try {
    const { description, status, priority, story_id } = req.body;

    let queryText = "SELECT board_id FROM story_to_board WHERE story_id = $1";
    let params = [story_id];
    let dbResponse = await db.query(queryText, params);
    res.locals.board_id = dbResponse.rows[0].board_id;

    queryText =
      "INSERT INTO task (description, status, priority) VALUES ($1, $2, $3) RETURNING _id;";
    params = [description, status, priority];
    dbResponse = await db.query(queryText, params);
    res.locals.task_id = dbResponse.rows[0]._id;

    queryText =
      "INSERT INTO task_to_story (task_id, story_id) VALUES ($1, $2);";
    params = [dbResponse.rows[0]._id, story_id];
    dbResponse = await db.query(queryText, params);

    return next();
  } catch (error) {
    return next({
      log: "Error creating a task",
      status: 500,
      message: { err: "Could not create the task" },
    });
  }
};
module.exports = boardsController;
