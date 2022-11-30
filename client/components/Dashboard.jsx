import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.scss";

const { BACKEND_URL } = process.env;

function Dashboard() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [board, setBoard] = useState([]);

  const checkCookie = () => {
    console.log("checking cookie...");

    fetch(`${BACKEND_URL}/dashboard`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 500) {
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setUsername(data.username);
        setBoard(data.boards);
      });
  };

  useEffect(() => {
    checkCookie();
  }, [board]);

  const deleteButton = (id) => {
    // delete a board that has specific id.
    fetch(`${BACKEND_URL}/api/board`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        board_id: id,
      }),
    });
  };

  const createBoard = () => {
    const test = "New Title";

    fetch(`${BACKEND_URL}/api/board`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: test,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBoard(data);
      });
  };

  return (
    <div>
      <header className='dashboard-header'>
        <h1 className='dashboard-welcome'>{`Welcome ${username}!`}</h1>
        <button
          className='dashboard-create-button'
          onClick={() => createBoard()}
        >
          Create +
        </button>
      </header>
      <div>
        {board.map((board) => (
          <div className='dashboard-boards'>
            <div className='board-element'>
              <h1 className='dashboard-board-title'>{board.title}</h1>
            </div>
            <div className='board-element'>
              <button
                className='board-element-button'
                id='dashboarddeletebutton'
                onClick={() => deleteButton(board.id)}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                className='board-element-button'
                onClick={() => {
                  navigate(`./board/${board.id}`);
                }}
                id={board.id}
              >
                {" "}
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
