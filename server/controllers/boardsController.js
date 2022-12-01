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
    let taskIds = dbResponse.rows;

    for (const taskItem of taskIds) {
      queryText =
        "SELECT description, status, priority, _id AS task_id FROM task WHERE _id = $1";
      params = [taskItem.task_id];
      dbResponse = await db.query(queryText, params);
      taskItem.description = dbResponse.rows[0].description;
      taskItem.status = dbResponse.rows[0].status;
      taskItem.priority = dbResponse.rows[0].priority;
      taskItem.task_id = dbResponse.rows[0].task_id;
      storyItem.tasks.push(taskItem);
    }
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
    for (const taskItem of taskIds) {
      queryText =
        "SELECT description, status, priority, _id AS task_id FROM task WHERE _id = $1";
      params = [taskItem.task_id];
      dbResponse = await db.query(queryText, params);
      taskItem.desc = dbResponse.rows[0].description;
      taskItem.status = dbResponse.rows[0].status;
      taskItem.priority = dbResponse.rows[0].priority;
      taskItem.task_id = dbResponse.rows[0].task_id;
      storyItem.tasks.push(taskItem);
    }
  }
  queryText = "SELECT title FROM board WHERE _id = $1";
  params = [res.locals.board_id];
  dbResponse = await db.query(queryText, params);
  let boardTitle = dbResponse.rows[0].title;
  res.locals.boardInfo = {
    title: boardTitle,
    board_id: res.locals.board_id,
    stories: stories,
  };
  return next();
};

boardsController.createBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    let queryText =
      "INSERT INTO board (title) VALUES ($1) RETURNING _id as board_id";
    let params = [title];
    let dbResponse = await db.query(queryText, params);
    res.locals.board_id = dbResponse.rows[0].board_id;
    res.locals.createdBoard = {
      id: dbResponse.rows[0].board_id,
      title,
    };
    queryText =
      "INSERT INTO board_to_user (board_id, user_id) VALUES ($1, $2);";
    params = [res.locals.board_id, res.locals.user_id];
    dbResponse = await db.query(queryText, params);
    return next();
  } catch (error) {
    return next({
      log: "boardsController.createBoard",
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
    res.locals.createdStory = {
      story_id: res.locals.story_id,
      text,
      completed,
    };
    return next();
  } catch (error) {
    return next({
      log: "boardsController.createStory",
      status: 500,
      message: { err: "Unable to create the story" },
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
    res.locals.createdTask = {
      description,
      priority,
      status,
      story_id,
      task_id: dbResponse.rows[0]._id,
    };
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

boardsController.deleteTask = async (req, res, next) => {
  try {
    const { task_id } = req.body;
    let queryText = "SELECT story_id FROM task_to_story WHERE task_id = $1";
    let params = [task_id];
    let dbResponse = await db.query(queryText, params);
    queryText = "SELECT board_id FROM story_to_board WHERE story_id = $1";
    params = [dbResponse.rows[0].story_id];
    dbResponse = await db.query(queryText, params);
    res.locals.board_id = dbResponse.rows[0].board_id;
    queryText = "DELETE FROM task WHERE _id = $1";
    params = [task_id];
    dbResponse = await db.query(queryText, params);
    queryText = "DELETE FROM task_to_story WHERE task_id = $1";
    params = [task_id];
    dbResponse = await db.query(queryText, params);
    return next();
  } catch (error) {
    return next({
      log: "Error creating a task",
      status: 500,
      message: { err: "Could not delete the task" },
    });
  }
};

boardsController.updateBoard = async (req, res, next) => {
  try {
    for (let i = 0 ; i < req.body.length; i++) {
      const { id, title, index } = req.body[i];
      let queryText = "UPDATE board SET title = $1, index = $2 WHERE _id = $3";
      let params = [title, index, id]; // [New Scrum Board 1, 0, 1]
      let dbResponse = await db.query(queryText, params);
    }
    return next();
  } catch (error) {
    return next({
      log: "boardController.updateBoardTitle",
      status: 500,
      message: { err: `Could not update the board\nQUERY: ${queryText}` },
    });
  }
};

boardsController.updateStory = async (req, res, next) => {
  try {
    const { text, completed, story_id } = req.body;
    let queryText = "UPDATE story SET text = $1, completed = $2 WHERE _id = $3";
    let params = [text, completed, story_id];
    let dbResponse = await db.query(queryText, params);
    return next();
  } catch (error) {
    return next({
      log: "boardsController.updateStory",
      status: 500,
      message: { err: "Unable to update the story" },
    });
  }
};

boardsController.updateTask = async (req, res, next) => {
  try {
    const { task_id, description, status, priority } = req.body;
    let queryText =
      "UPDATE task SET description = $1, status = $2, priority = $3 WHERE _id = $4";
    let params = [description, status, priority, task_id];
    let dbResponse = await db.query(queryText, params);
    return next();
  } catch (error) {
    return next({
      log: "boardsController.updateTask",
      status: 500,
      message: { err: "Unable to update the task" },
    });
  }
};

module.exports = boardsController;
