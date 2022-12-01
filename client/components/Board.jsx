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

  const deleteStory = (storyToBeDeleted) => {
    fetch(`${BACKEND_URL}/api/story`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyToBeDeleted),
    }).then((serverResponse) => {
      if (serverResponse.status >= 200 && serverResponse.status <= 299) {
        const newStories = [...stories];
        newStories.splice([stories.indexOf(storyToBeDeleted)], 1);
        setStories(newStories);
      }
    });
  };

  const deleteTask = (taskToBeDeleted) => {
    fetch(`${BACKEND_URL}/api/task`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskToBeDeleted),
    }).then((serverResponse) => {
      if (serverResponse.status >= 200 && serverResponse.status <= 299) {
        switch (taskToBeDeleted.status) {
          case "TO_DO":
            const newTasksToDo = [...tasksToDo];
            newTasksToDo.splice(newTasksToDo.indexOf(taskToBeDeleted), 1);
            setTasksToDo(newTasksToDo);
            break;
          case "IN_PROCESS":
            const newTasksInProcess = [...tasksInProcess];
            newTasksInProcess.splice(
              tasksInProcess.indexOf(taskToBeDeleted),
              1
            );
            setTasksInProcess(newTasksInProcess);
            break;
          case "IN_TESTING":
            const newTasksInTesting = [...tasksInTesting];
            newTasksInTesting.splice(
              tasksInTesting.indexOf(taskToBeDeleted),
              1
            );
            setTasksInTesting(newTasksInTesting);
            break;
          case "DONE":
            newTasksDone = [...tasksDone];
            newTasksDone.splice(tasksDone.indexOf(taskToBeDeleted), 1);
            setTasksDone(newTasksDone);
            break;
        }
      }
    });
  };

  const updateStory = (updatedStory) => {
    // updatedStory is an object containing the updated story properties
    fetch(`${BACKEND_URL}/api/story`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStory),
    })
  };

  const updateTask = (updatedTask) => {
    // updatedStory is an object containing the updated story properties
    fetch(`${BACKEND_URL}/api/task`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
  };

  const moveRight = (task) => {
    switch (task.status) {
      case "TO_DO":
        task.status = "IN_PROCESS";
        const newTasksToDo = [...tasksToDo]
        newTasksToDo.splice(tasksToDo.indexOf(task), 1);
        setTasksToDo(newTasksToDo);
        const newTasksInProcess = [...tasksInProcess];
        newTasksInProcess.push(task);
        setTasksInProcess(newTasksInProcess);
        break;
      case "IN_PROCESS":
        task.status = "IN_TESTING";
        const newTasksInProcess2 = [...tasksInProcess];
        newTasksInProcess2.splice(tasksInProcess.indexOf(task), 1);
        setTasksInProcess(newTasksInProcess2);
        const newTasksInTesting2 = [...tasksInTesting];
        newTasksInTesting2.push(task);
        setTasksInTesting(newTasksInTesting2);
        break;
      case "IN_TESTING":
        task.status = "DONE";
        const newTasksInTesting = [...tasksInTesting];
        newTasksInTesting.splice(tasksInTesting.indexOf(task), 1);
        setTasksInTesting(newTasksInTesting);
        const newTasksDone = [...tasksDone];
        newTasksDone.push(task);
        setTasksDone(newTasksDone);
        break;
    }
    return task;
  }

  const moveLeft = (task) => {
    switch (task.status) {
      case "IN_PROCESS":
        task.status = "TO_DO";
        const newTasksInProcess = [...tasksInProcess]
        newTasksInProcess.splice(tasksInProcess.indexOf(task), 1);
        setTasksToDo(newTasksToDo);
        const newTasksToDo = [...tasksToDo];
        newTasksToDo.push(task);
        setTasksToDo(newTasksToDo);
        break;
      case "IN_TESTING":
        task.status = "IN_PROCESS";
        const newTasksInTesting2 = [...tasksInTesting]
        newTasksInTesting2.splice(tasksInTesting.indexOf(task), 1);
        setTasksInTesting(newTasksInTesting2);
        const newTasksInProcess2 = [...tasksInProcess];
        newTasksInProcess2.push(task);
        setTasksInProcess(newTasksInProcess2);
        break;
      case "DONE":
        task.status = "IN_TESTING";
        const newTasksDone3 = [...tasksDone]
        newTasksDone3.splice(tasksDone.indexOf(task), 1);
        setTasksDone(newTasksDone3);
        const newTasksInTesting3 = [...tasksInTesting];
        newTasksInTesting3.push(task);
        setTasksInTesting(newTasksInTesting3);
        break;
    }
    return task;
  }

  return (
    <div>
      <body className="cards-container">
        
        <div className="column">
          <h1 className="board-heading">Stories</h1>
          {stories.map((story) => (
            <div className="cards">
              <textarea
                className="updateable-title story"
                value={story.text}
                onChange={(event) => {
                  const newStories = [...stories];
                  newStories[stories.indexOf(story)].text = event.target.value;
                  setStories(newStories);
                  event.target.style.height = event.target.scrollHeight + "px";
                }}
                onBlur={() => {
                  updateStory(story);
                }}
              ></textarea>
              <button
                className="card-button"
                onClick={() => {
                  deleteStory(story);
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
          <div className="button-row">
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
              <textarea
                className="updateable-title"
                onChange={(event) => {
                  const newTasksToDo = [...tasksToDo];
                  newTasksToDo[tasksToDo.indexOf(taskToDo)].description =
                    event.target.value;
                  setTasksToDo(newTasksToDo);
                  event.target.style.height = event.target.scrollHeight + "px";
                }}
                onBlur={() => {
                  updateTask(taskToDo);
                }}
              >
                {taskToDo.description}
              </textarea>
              <button
                className="card-button"
                onClick={() => deleteTask(taskToDo)}
              >
                Delete
              </button>
              <button className="card-button"
              onClick={() => updateTask(moveRight(taskToDo))}>&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">In Process</h1>
          {tasksInProcess.map((taskInProcess) => (
            <div className="cards">
              <textarea
                className="updateable-title"
                onChange={(event) => {
                  const newTasksInProcess = [...tasksInProcess];
                  newTasksInProcess[tasksInProcess.indexOf(taskInProcess)].description =
                    event.target.value;
                  setTasksInProcess(newTasksInProcess);
                  event.target.style.height = event.target.scrollHeight + "px";
                }}
                onBlur={() => {
                  updateTask(taskInProcess);
                }}
              >
                {taskInProcess.description}
              </textarea>
              <button
                className="card-button"
                onClick={() => deleteTask(taskInProcess)}
              >
                Delete
              </button>
              <button className="card-button"
                onClick={() => updateTask(moveLeft(taskInProcess))}
              >&lt;</button>
              <button className="card-button"
                onClick={() => updateTask(moveRight(taskInProcess))}
              >&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">In Testing</h1>
          {tasksInTesting.map((taskInTesting) => (
            <div className="cards">
              <textarea
                className="updateable-title"
                onChange={(event) => {
                  const newTasksInTesting = [...tasksInTesting];
                  newTasksInTesting[tasksInTesting.indexOf(taskInTesting)].description =
                    event.target.value;
                  setTasksInTesting(newTasksInTesting);
                  event.target.style.height = event.target.scrollHeight + "px";
                }}
                onBlur={() => {
                  updateTask(taskInTesting);
                }}
              >
                {taskInTesting.description}
              </textarea>
              <button
                className="card-button"
                onClick={() => deleteTask(taskInTesting)}
              >
                Delete
              </button>
              <button className="card-button"
                onClick={() => updateTask(moveLeft(taskInTesting))}
              >&lt;</button>
              <button className="card-button"
                onClick={() => updateTask(moveRight(taskInTesting))}
              >&gt;</button>
            </div>
          ))}
        </div>

        <div className="column">
          <h1 className="board-heading">Done</h1>
          {tasksDone.map((taskDone) => (
            <div className="cards">
              <textarea
                className="updateable-title"
                onChange={(event) => {
                  const newTasksDone = [...tasksDone];
                  newTasksDone[tasksDone.indexOf(taskDone)].description =
                    event.target.value;
                  setTasksDone(newTasksDone);
                  event.target.style.height = event.target.scrollHeight + "px";
                }}
                onBlur={() => {
                  updateTask(taskDone);
                }}
              >
                {taskDone.description}
              </textarea>
              <button
                className="card-button"
                onClick={() => deleteTask(taskDone)}
              >
                Delete
              </button>
              <button className="card-button"
                onClick={() => updateTask(moveLeft(taskDone))}
              >&lt;</button>
            </div>
          ))}
        </div>
        
      </body>
    </div>
  );
}

export default Board;
