import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Board.scss";

const { BACKEND_URL } = process.env;

function Board() {
  const board_id = useParams().id;
  const [board, setBoard] = useState([]);
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
            setTasksToDo((toDo) => [...toDo, task]);
            break;
          case "IN_PROCESS":
            setTasksInProcess((process) => [...process, task]);
            break;
          case "IN_TESTING":
            setTasksInTesting((testing) => [...testing, task]);
            break;
          case "DONE":
            setTasksDone((done) => [...done, task]);
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

  const addTaskToStory = (description, status, priority, story_id) => {
    fetch(`${BACKEND_URL}/api/task`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        status,
        priority,
        story_id,
      }),
    })
      .then((serverResponse) => {
        return serverResponse.json();
      })
      .then((serverResponseJson) => {
        setStories(serverResponseJson.stories);
        setTodo();
        for (const story of serverResponseJson.stories) {
          setTodo([...tasksToDo, story.tasks]);
          // for (const task of story.tasks) {
          //   task.story_id = story.story_id;
          //   switch (task.status) {
          //     case "TO_DO":
          //       setToDo(task)
          //       break;
          //     case "IN_PROCESS":
          //       setProcess((process) => [...process, task])
          //       break;
          //     case "IN_TESTING":
          //       setTesting((testing) => [...testing, task])
          //       break;
          //     case "DONE":
          //       setDone((done) => [...done, task])
          //       break;
          //     default:
          //       break;
          //   }
          // }
        }
      });
  };

  return (
    <div>
      {/* should have username on left top */}

      {/* should have functionality of creating new boad */}
      <body className="cards-container">
        <div className="column">
          <h1 className="board-heading">Stories</h1>
          {stories.map((story) => (
            <div className="cards">
              <form>
                <textarea
                  className="textarea"
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
                // onClick={() =>
                //   addTaskToStory("new task", "TO_DO", 1, story.story_id)
                // }
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
          {tasksToDo.map((board) => (
            <div className="cards">
              <h2>{board.desc}</h2>
              <button className="card-button">Delete</button>
              {/* <button className="card-button">&lt;</button> */}
              <button className="card-button">&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">In Process</h1>
          {tasksInProcess.map((board) => (
            <div className="cards">
              <h2>{board.desc}</h2>
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
              <h2>{board.desc}</h2>
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
              <h2>{board.desc}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">Done</button>
            </div>
          ))}
        </div>
      </body>

      {board.map((board) => (
        <div key={board.id}>
          <h2>{board.name}</h2>
          <p>{board.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Board;
