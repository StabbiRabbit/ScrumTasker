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

module.exports = boardsController;
