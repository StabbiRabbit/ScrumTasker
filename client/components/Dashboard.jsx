import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import "../styles/Dashboard.scss";

const { BACKEND_URL } = process.env;

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [boards, setBoards] = useState([]);

  // On initial page load, check if the session is valid and grab user data
  useEffect(() => {
    validateSessionAndGetUserData();
  }, []);

  const updateBoardTitleById = (board_id, title) => {
    fetch(`${BACKEND_URL}/api/board`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({
        board_id,
        title
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((serverResponse) => {
        if (serverResponse.status >= 200 && serverResponse.status <= 299) {
          return;
        }
      })
  }

  // Grab user data (name, boards) from database by cookie SSID
  const validateSessionAndGetUserData = () => {    
    fetch(`${BACKEND_URL}/api/dashboard`, {
      method: "GET",
      credentials: "include",
    })
      .then((serverResponse) => {
        // If session is invalid, redirect to login page
        if (serverResponse.status >= 500 && serverResponse.status <= 599) {
          return navigate("/");
        }
        return serverResponse.json();
      })
      .then((serverResponseJson) => {
        setUsername(serverResponseJson.username);
        setBoards([...serverResponseJson.boards]);
      });
  }

  const createNewBoard = (title) => {
    fetch(`${BACKEND_URL}/api/board`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    })
      .then((serverResponse) => serverResponse.json())
      .then((serverResponseJson) => {
        setBoards([...boards, serverResponseJson]);
      });
  };

  const deleteBoardById = (board_id) => {
    fetch(`${BACKEND_URL}/api/board`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        board_id,
      }),
    })
    .then( (serverResponse) => {
      if (serverResponse.status >= 200 && serverResponse.status <= 299) {
        const newBoards = [...boards];
        for (let i = 0; i < newBoards.length; i++) {
          if (newBoards[i].id === board_id) {
            newBoards.splice(i, 1);
            break;
          }
        }
        setBoards(newBoards);
      }
    })
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">Welcome <span className="dashboard-username">{username}</span></h1>
        <button
          className="dashboard-create-button"
          onClick={() => createNewBoard("New Scrum Board " + (boards.length + 1))}
        >
          Create +
        </button>
      </header>
      <div>
        {boards.map((board) => (
          <div className="dashboard-boards">
            <div className="board-element">
              {/* <h1 className="dashboard-board-title">{board.title}</h1> */}
              <form 
                onBlur={(e) => {
                  const title = board.title;
                  updateBoardTitleById(board.id, title)}
                }
                onSubmit={(e) => {
                e.preventDefault();
                const title = board.title;
                updateBoardTitleById(board.id, title)
              }}>
                <input type="text" 
                // onDoubleClick={(event) => event.target.removeAttribute("readonly")}
                // readOnly 
                value={board.title} onChange={(e) => {
                  const newBoards = [...boards];
                  for (let i = 0; i < newBoards.length; i++) {
                    let newBoard = Object.assign({}, newBoards[i]);
                    if (newBoard.id === board.id) {
                      newBoard.title = e.target.value
                    }
                    newBoards[i] = newBoard;
                  }
                  setBoards([...newBoards]);
                }}></input>
              </form>
            </div>
            <div className="board-element">
              <button
                className="board-element-button delete-button"
                onClick={() => deleteBoardById(board.id)}
              >
                Delete
              </button>
              <button
                className="board-element-button"
                onClick={() => {
                  navigate(`../board/${board.id}`);
                }}
                id={board.id}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
