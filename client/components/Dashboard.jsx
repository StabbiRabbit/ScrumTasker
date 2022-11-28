import React, { useEffect, useState } from "react";
import "../styles/Dashboard.scss"

function Dashboard() {

  const [userName, setUserName] = useState("Jason");
  const [board, setBoard] = useState([{ title: 'title1' }, { title: 'title2' }, { title: 'title3' }, { title: 'title4' }])
  const [editMode, setEditMode] = useState(false)

  const deleteButton = (id) => {
    setBaord(board.filter((board) => board.id !== id))
  }

  const createBoard = () => {
    setBoard((oldArray) => [...oldArray, { title: 'new title' }])
  }

  const editBoard = () => {

  }

  const changeTitle = () => { 

  }

  return (
    <div>
      <header className="dashboard-header">

        
        <h1>{`Welcome ${userName}!`}</h1>
        <button onClick={createBoard}>Create +</button>
      </header>
      <body className="dashboard-boards">
        {/* this div is mappable */}
        {/* <div>
          <h2>Board Example</h2>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}

        {board.map((board) => (
        <div className="dashboard-boards"> 
            <h1 onDoubleClick={changeTitle}>{board.title}</h1>
            <button onClick={() => deleteButton(board.id)}> Delete </button>
            <button onClick={editBoard}> Edit</button>
        </div>
      ))}

      </body>
      
    </div>
  )
}

export default Dashboard;
