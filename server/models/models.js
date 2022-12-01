const { Sequelize, Model, DataTypes } = require('sequelize');

const { PG_URI } = process.env;

//Creating an instance of Sequelize to connect ot the database, passing in single connection URI
const sequelize = new Sequelize(PG_URI);

// DEFINING SEQUELIZE MODELS
// models -> Contains every model we'll be using in the middlware for scrum components
const models = {};

// Sequelize Task Model
models.Tasks = sequelize.define("tasks", {
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

models.Stories = sequelize.define("stories", {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  board_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// models.Boards = sequelize.define("boards", {
//   title: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   }
// })



// 

// Creating a  model
(async () => {
  await sequelize.sync();
  // Code here
})();

module.exports = models;