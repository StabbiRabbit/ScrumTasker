import React, { useState, useEffect } from "react";
import "../styles/Board.scss"

function Board() {

  const [board, setBoard] = useState([])
  const [userName, setUserName] = useState("")
  const [story, setStory] = useState([{ title: 'signup', description: 'user must be albe to sign up'}, {title: 'createboard', description: 'user must be able to create board'}])
  const [toDo, setToDo] = useState([{ title: 'put sign up', description: 'karan put up a sign up feature'}, {title: 'create a board', description: 'jason put up a create board feature'}]);
  const [process, setProcess] = useState([{ title: 'signup', description: 'user must be albe to sign up' }, { title: 'createboard', description: 'user must be able to create board' }]);
  const [validation, setValidation] = useState([{ title: 'signup', description: 'user must be albe to sign up'}, {title: 'createboard', description: 'user must be able to create board'}]);
  const [done, setdone] = useState([{ title: 'signup', description: 'user must be albe to sign up'}, {title: 'createboard', description: 'user must be able to create board'}]);

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
    fetch('/api/board')
     .then(response => response.json())
      .then(json => {
        setBoard(json.board);
        setUserName(json.userName);
      })
  }, [])

  return (
    <div>
      {/* should have username on left top */}
      <header>
        <h1>{`Welcome ${userName}!`}</h1>
      </header>

      {/* should have functionality of creating new boad */}
    <body className="cards-container">
      <div className="story-boards">
        {/* <div className="example">
          <h2>story Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {story.map(board => (
            <div className="example">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button>Delete</button>
              <button>Edit</button>
            </div>))}
        <button onClick={addStoryBoard}>Add New</button>
      </div>

      <div className="todo-boards">
        {/* <div className="example">
          <h2>to do Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
        {toDo.map(board => (
            <div className="example">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button>Delete</button>
              <button>Edit</button>
            </div>))}
        <button onClick={addToDoBoard}>Add New</button>
      </div>

      <div className="process-boards">
        {/* <div className="example">
          <h2>in process Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {process.map(board => (
            <div className="example">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button>Delete</button>
              <button>Edit</button>
            </div>))}
        <button onClick={addProcessBoard}>Add New</button>
      </div>

      <div className="validation-boards">
          {/* <div className="example">
          <h2>validation Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {validation.map(board => (
            <div className="example">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button>Delete</button>
              <button>Edit</button>
            </div>))}
        <button onClick={addValidationBoard}>Add New</button>
      </div>

      <div className="done-boards">
        {/* <div className="example">
          <h2>done Board Example</h2>
          <p>will map this board div</p>
          <button> Delete </button>
          <button> Edit</button>
        </div> */}
          {done.map(board => (
            <div className="example">
              <h2>{board.title}</h2>
              <p>{board.description}</p>
              <button>Delete</button>
              <button>Edit</button>
            </div>))}
        <button onClick={addDoneBoard}>Add New</button>
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

