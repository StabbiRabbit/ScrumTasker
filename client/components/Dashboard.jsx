import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.scss";

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [boards, setBoards] = useState([]);

  // On initial page load, check if the session is valid and grab user data
  useEffect(() => {
    validateSessionAndGetUserData();
  }, []);

  // Grab user data (name, boards) from database by cookie SSID
  const validateSessionAndGetUserData = () => {
    fetch("http://localhost:3000/dashboard", {
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
        setBoards(serverResponseJson.boards);
      });
  };

  const createNewBoard = (title) => {
    fetch("http://localhost:3000/create/board", {
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
        setBoards(serverResponseJson.boards);
      });
  };

  const deleteBoardById = (board_id) => {
    fetch("http://localhost:3000/delete/board", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        board_id,
      }),
    });
  };

  return (
    <div>
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">{`Welcome ${username}!`}</h1>
        <button
          className="dashboard-create-button"
          onClick={() => createNewBoard()}
        >
          Create +
        </button>
      </header>
      <div>
        {boards.map((board) => (
          <div className="dashboard-boards">
            <div className="board-element">
              <h1 className="dashboard-board-title">{board.title}</h1>
            </div>
            <div className="board-element">
              <button
                className="board-element-button"
                id="dashboarddeletebutton"
                onClick={() => deleteBoardById(board.id)}
              >
                Delete
              </button>
              <button
                className="board-element-button"
                onClick={() => {
                  navigate(`./board/${board.id}`);
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
