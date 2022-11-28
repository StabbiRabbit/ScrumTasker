const db = require("../db.js");

const boardsController = {};

boardsController.getBoardFromUser = async (req, res, next) => {
  const { id } = req.params;
  let queryText = "SELECT story_id FROM story_to_board WHERE board_id = $1";
  let params = [id];
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
    console.log(dbResponse.rows);
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
  console.log(res.locals.boardInfo);
  return next();
};

boardsController.createBoard = async (req, res, next) => {
  try {
    const { title, user_id } = req.body;
    let queryText = "INSERT INTO board (title) OUTPUT Inserted.ID VALUES ($1);";
    let params = [title];
    let dbResponse = await db.query(queryText, params);
    console.log(dbResponse);
    res.locals.board_id = dbResponse;

    queryText =
      "INSERT INTO board_to_user (board_id, user_id) VALUES ($1, $2);";
    params = [dbResponse, user_id];
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
      "INSERT INTO story (text, completed) OUTPUT Inserted.ID VALUES ($1, $2);";
    let params = [text, completed];
    let dbResponse = await db.query(queryText, params);
    console.log(dbResponse);
    res.locals.story_id = dbResponse;

    queryText =
      "INSERT INTO story_to_board (story_id, board_id) VALUES ($1, $2);";
    params = [dbResponse, board_id];
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
      "INSERT INTO task (description, status, priority) OUTPUT Inserted.ID VALUES ($1, $2, $3);";
    let params = [description, status, priority];
    let dbResponse = await db.query(queryText, params);
    console.log(dbResponse);
    res.locals.task_id = dbResponse;

    queryText =
      "INSERT INTO task_to_story (task_id, story_id) VALUES ($1, $2);";
    params = [dbResponse, story_id];
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
