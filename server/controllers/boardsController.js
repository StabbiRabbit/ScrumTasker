const db = require("../db.js");

const boardsController = {};

boardsController.getStoryBoardFromUser = async (req, res, next) => {
  const { id } = req.params;
  let queryText = "SELECT story_id FROM story_to_board WHERE board_id = $1";
  let params = [id];
  let dbResponse = await db.query(queryText, params);
  const storyId = dbResponse.rows;
  //   console.log(storyId);
  [{ story_id: 1 }, { story_id: 5 }];
  const stories = [];
  //   const template = {
  //     title: "tasea",
  //     id: 2,
  //     stories: [
  //     {title: "asdas",
  //     comepeted: true,
  //     tasks: [
  //     {desc: "asdas",
  //     priority: 1,
  //     status: "done"}
  //     ]
  //    }
  //   ]
  // }
  for (const story of storyId) {
    queryText =
      "SELECT text, completed, _id AS storyid FROM story WHERE _id = $1";
    params = [story.story_id];
    dbResponse = await db.query(queryText, params);
    // console.log(dbResponse.rows[0]);
    stories.push(dbResponse.rows[0]);
  }
  //   { text: 'creating login page', completed: false, storyid: 1 }

  for (const storyItem of stories) {
    storyItem.tasks = [];
    queryText = "SELECT task_id FROM task_to_story WHERE story_id = $1";
    params = [storyItem.storyid];
    dbResponse = await db.query(queryText, params);
    console.log(dbResponse.rows);
  }
  //   dbResponse = await db.query(queryText, params);
  //   const boardIds = dbResponse.rows;
  //   // console.log(boardIds);
  //   const boards = [];
  //   for (const boardId of boardIds) {
  //     queryText = "SELECT title, _id AS id FROM boards WHERE _id = $1";
  //     params = [boardId.board_id];
  //     dbResponse = await db.query(queryText, params);
  //     boards.push(...dbResponse.rows);
  //   }
  //   res.locals.boards = boards;
  //   res.locals.username = username;
  return next();
};

module.exports = boardsController;
