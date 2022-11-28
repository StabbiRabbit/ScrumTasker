import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import "../styles/Board.scss"

function Board() {
  const { id } = useParams();

  const [board, setBoard] = useState([])
  const [userName, setUserName] = useState("")
  const [story, setStory] = useState([])
  const [toDo, setToDo] = useState([]);
  const [process, setProcess] = useState([]);
  const [validation, setValidation] = useState([]);
  const [done, setdone] = useState([]);

  const addStoryBoard = () => {
    setStory((oldArray) => [...oldArray, { title: 'new title' }])
  }

  const addToDoBoard = () => { 
    setToDo((oldArray) => [...oldArray, { title: 'new title', description: 'new description'}])
  }

  const addProcessBoard = () => {
    setProcess((oldArray) => [...oldArray, { title: 'new title', description: 'new description' }])
  }

  const addValidationBoard = () => { 
    setValidation((oldArray) => [...oldArray, { title: 'new title' , description: 'new description'}])
  }

  const addDoneBoard = () => { 
    setdone((oldArray) => [...oldArray, { title: 'new title', description: 'new description' }])
  }

  useEffect(() => {
    // fetched object data should have board object and username
    fetch(`http://localhost:3000/board/${id}`, {
      method: 'GET',
      credentials: "include"
    })
     .then(response => response.json())
      .then(json => {
        console.log(json.stories);
      })
  }, [])

  return (
    <div>
      {/* should have username on left top */}
      <header className="board-header">
        <h1 className="board-title">{`Welcome ${userName}!`}</h1>
      </header>

      {/* should have functionality of creating new boad */}
    <body className="cards-container">
      <div className="boards">
        {/* <div className="example">
          <h2>story Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {story.map(board => (
            <div className="cards">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button">Edit</button>
            </div>))}
        <button onClick={addStoryBoard} className="add-card-button">Add New</button>
      </div>

      <div className="boards">
        {/* <div className="example">
          <h2>to do Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
        {toDo.map(board => (
            <div className="cards">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button">Edit</button>
            </div>))}
        <button onClick={addToDoBoard} className="add-card-button">Add New</button>
      </div>

      <div className="boards">
        {/* <div className="example">
          <h2>in process Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {process.map(board => (
            <div className="cards">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button">Edit</button>
            </div>))}
        <button onClick={addProcessBoard} className="add-card-button">Add New</button>
      </div>

      <div className="boards">
          {/* <div className="example">
          <h2>validation Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {validation.map(board => (
            <div className="cards">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button">Edit</button>
            </div>))}
        <button onClick={addValidationBoard} className="add-card-button">Add New</button>
      </div>

      <div className="boards">
        {/* <div className="example">
          <h2>done Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {done.map(board => (
            <div className="cards">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button">Edit</button>
            </div>))}
        <button onClick={addDoneBoard} className="add-card-button">Add New</button>
        </div>
      </body>
      
        
      {board.map((board) => (
        <div key={board.id}>
          <h2>{board.name}</h2>
          <p>{board.description}</p>
        </div>
      ))}

    </div>
  )
}

export default Board;

