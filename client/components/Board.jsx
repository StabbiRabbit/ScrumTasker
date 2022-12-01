import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Board.scss";

const { BACKEND_URL } = process.env;

function Board() {
  const board_id = useParams().id;
  // const [board, setBoard] = useState([]);
  const [stories, setStories] = useState([]);
  const [tasksToDo, setTasksToDo] = useState([]);
  const [tasksInProcess, setTasksInProcess] = useState([]);
  const [tasksInTesting, setTasksInTesting] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);

  useEffect(() => {
    getBoardDataAndMapToState();
  }, []);

  const getBoardDataAndMapToState = async () => {
    let serverResponse = await fetch(`${BACKEND_URL}/api/board/${board_id}`, {
      method: "GET",
      credentials: "include",
    });
    serverResponse = await serverResponse.json();
    setStories(serverResponse.stories);
    for (const story of serverResponse.stories) {
      for (const task of story.tasks) {
        task.story_id = story.story_id;
        switch (task.status) {
          case "TO_DO":
            setTasksToDo((tasksToDo) => [...tasksToDo, task]);
            break;
          case "IN_PROCESS":
            setTasksInProcess((tasksInProcess) => [...tasksInProcess, task]);
            break;
          case "IN_TESTING":
            setTasksInTesting((tasksInTesting) => [...tasksInTesting, task]);
            break;
          case "DONE":
            setTasksDone((tasksDone) => [...tasksDone, task]);
            break;
          default:
            break;
        }
      }
    }
  };

  const addStoryToBoard = (storyWithoutId) => {
    fetch(`${BACKEND_URL}/api/story`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyWithoutId),
    })
      .then((serverResponse) => {
        return serverResponse.json();
      })
      .then((serverResponseJson) => {
        const createdStory = serverResponseJson;
        setStories([...stories, createdStory]);
      });
  };

  const deleteStoryById = (storyId) => {
    fetch(`${BACKEND_URL}/api/story`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyId),
    }).then((serverResponse) => {
      if (serverResponse.status >= 200 && serverResponse.status <= 299) {
        const newStories = [...stories];
        for (let i = 0; i < newStories.length; i++) {
          if (newStories[i] === storyId) {
            newStories.splice(i, 1);
            break;
          }
        }
        setStories(newStories);
      }
    });
  };

  const updateStoryText = (updatedStory) => {
    // updatedStory is an object containing the updated story properties
    fetch(`${BACKEND_URL}/api/story`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStory),
    }).then((serverResponse) => {
      // The client should expect to receive status code, only, from the server
      // Based on the status code from the server, update the piece of state and re-render
      if (serverResponse.status >= 200 && serverResponse.status <= 299) {
        const newStories = [...stories];
        for (let i = 0; i < newStories.length; i++) {
          if (newStories[i].story_id === updatedStory.story_id) {
            newStories[i] = updatedStory;
          }
        }
        setStories(newStories);
      }
    });
  };

  const addTaskToStory = (newTask) => {
    fetch(`${BACKEND_URL}/api/task`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((serverResponse) => {
        // if (response.status >= 200 && response.status <= 299)
          return serverResponse.json();
      })
      .then((serverResponseJson) => {
        const createdTask = serverResponseJson;
        console.log(createdTask);
        switch (createdTask.status) {
          case "TO_DO":
            setTasksToDo((tasksToDo) => [...tasksToDo, createdTask]);
            break;
          case "IN_PROCESS":
            setTasksInProcess([...tasksInProcess, createdTask]);
            break;
          case "IN_TESTING":
            setTasksInTesting([...tasksInTesting, createdTask]);
            break;
          case "DONE":
            setTasksDone([...tasksDone, createdTask]);
            break;
        }
      });
  };

  return (
    <div>
      <body className="cards-container">
        <div className="column">
          <h1 className="board-heading">Stories</h1>
          {stories.map((story) => (
            <div className="cards">
              <form>
                <textarea
                  className="updateable-title story"
                  value={story.text}
                  onChange={(event) => {
                    const newStories = [...stories];
                    for (let i = 0; i < newStories.length; i++) {
                      let newStory = Object.assign({}, newStories[i]);
                      if (newStory.story_id === story.story_id) {
                        newStory.text = event.target.value;
                      }
                      newStories[i] = newStory;
                    }
                    setStories(newStories);
                    event.target.style.height =
                      event.target.scrollHeight + "px";
                  }}
                  onBlur={(event) => {
                    updateStoryText(story);
                  }}
                  onSubmit={(event) => {
                    event.preventDefault();
                    updateStoryText(story);
                  }}
                ></textarea>
              </form>
              <button
                className="card-button"
                onClick={() => {
                  deleteStoryById(story);
                }}
              >
                Delete
              </button>
              <button
                className="card-button"
                onClick={() =>
                  addTaskToStory({
                    description: "Task description",
                    status: "TO_DO",
                    priority: 1,
                    story_id: story.story_id,
                  })
                }
              >
                New Task
              </button>
            </div>
          ))}
          <div className="button-container">
            <button
              onClick={() => {
                addStoryToBoard({
                  board_id,
                  text: `New Story ${stories.length + 1}`,
                  completed: false,
                });
              }}
              className="add-card-button"
            >
              +
            </button>
          </div>
        </div>

        <div className="column">
          <h1 className="board-heading">To Do</h1>
          {tasksToDo.map((taskToDo) => (
            <div className="cards">
              <textarea className="updateable-title">{taskToDo.description}</textarea>
              <button className="card-button">Delete</button>
              {/* <button className="card-button">&lt;</button> */}
              <button className="card-button">&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">In Process</h1>
          {tasksInProcess.map((taskInProcess) => (
            <div className="cards">
              <h2>{taskInProcess.description}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">In Testing</h1>
          {tasksInTesting.map((board) => (
            <div className="cards">
              <h2>{board.description}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">Done</h1>
          {tasksDone.map((board) => (
            <div className="cards">
              <h2>{board.description}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">Done</button>
            </div>
          ))}
        </div>
      </body>

    </div>
  );
}

export default Board;
