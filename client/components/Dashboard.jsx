import React, { useEffect, useState } from "react";
import "../styles/Dashboard.scss"

function Dashboard() {

  const [userName, setUserName] = useState("Jason");
  const [board, setBoard] = useState([{ title: 'title1' }, { title: 'title2' }, { title: 'title3' }, { title: 'title4' }])
  // const [editMode, setEditMode] = useState(false)

  const deleteButton = (id) => {
    setBaord(board.filter((board) => board_id !== id))

    // delete a board that has specific id.
    // fetch('', {
    //   method: "",
    //   header: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     title: 'new title',
    //     id: null
    //   })
    // })
  }

  const createBoard = () => {
    setBoard((oldArray) => [...oldArray, { title: 'new title' }])

    // posting new board to the user's dashboard

    // fetch('', {
    //   method: "",
    //   header: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     title: 'new title',
    //     id: null
    //   })
    // })
      
  }

  const openBoard = () => {
    navigate(`/board/:${board_id}`)
  }

  // const changeTitle = (e) => { 
  //   console.log(e.target.value)
  // }



  return (
    <div>
      <header className="dashboard-header">
        <h1 className="dashboard-welcome">{`Welcome ${userName}!`}</h1>
        <button className="dashboard-create-button" onClick={createBoard}>Create +</button>
      </header>
      <div>
        {board.map((board) => (
        <div className="dashboard-boards"> 
          {/* {
            editMode ? 
            <form>
            <input type = 'text' onChange={changeTitle} defaultValue = {board.title}/> 
            </form>
                : <div className="board-element">
                    <h1 onDoubleClick={() => setEditMode(true)}>{board.title}</h1>
                  </div>
          } */}
            <div className="board-element">
                    <h1 className="dashboard-board-title">{board.title}</h1>
                  </div>
            <div className="board-element">
              <button className="board-element-button" onClick={() => deleteButton(board.id)}> Delete </button>
              <button className="board-element-button" onClick={openBoard}> Open</button>
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard;
