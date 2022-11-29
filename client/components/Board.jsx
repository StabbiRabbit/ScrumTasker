import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import "../styles/Board.scss"

function Board() {
  const { id } = useParams();

  const [board, setBoard] = useState([])
  const [stories, setStories] = useState([])
  const [toDo, setToDo] = useState([]);
  const [process, setProcess] = useState([]);
  const [testing, setTesting ] = useState([]);
  const [done, setDone] = useState([]);

  const addStoryBoard = () => {
    setStories((oldArray) => [...oldArray, { title: 'new title' }])
  }

  const addToDoBoard = (description, status, priority, story_id) => { 
    // setToDo((oldArray) => [...oldArray, { title: 'new title', description: 'new description'}])

    fetch('http://localhost:3000/create/task', {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description,
        status,
        priority,
        story_id: story_id
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      setStories(responseJson.stories);
      setTodo();
      for (const story of responseJson.stories) {
        setTodo([...toDo, story.tasks])
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
   })
}

  const addProcessBoard = () => {
    setProcess((oldArray) => [...oldArray, { title: 'new title', description: 'new description' }])
  }

  const addValidationBoard = () => { 
    setTesting((oldArray) => [...oldArray, { title: 'new title' , description: 'new description'}])
  }

  const addDoneBoard = () => { 
    setdone((oldArray) => [...oldArray, { title: 'new title', description: 'new description' }])

    
    
  }

  const fetchAndSort = async () => {
    let data = await fetch(`http://localhost:3000/board/${id}`, {
      method: 'GET',
      credentials: "include"
    })
    data = await data.json();
    setStories(data.stories);
    for (const story of data.stories) {
      for (const task of story.tasks) {
        task.story_id = story.story_id;
        switch (task.status) {
          case "TO_DO":
            setToDo((toDo) => [...toDo, task])
            break;
          case "IN_PROCESS":
            setProcess((process) => [...process, task])
            break;
          case "IN_TESTING":
            setTesting((testing) => [...testing, task])
            break;
          case "DONE":
            setDone((done) => [...done, task])
            break;
          default:
            break;
        }
      }
    }
  }
  

  useEffect(() => {
    // fetched object data should have board object and username
    fetchAndSort();
  }, [])


  
  return (
    <div>
      {/* should have username on left top */}
      

      {/* should have functionality of creating new boad */}
      <body className="cards-container">
        <div className="column">
          <h1 className="board-heading">Stories</h1>
          {stories.map(story => (
            <div className="cards">
              <h2>{story.text}</h2>
              <p>{story.description}</p>
              <button className="card-button">Delete</button>
              <button className="card-button" onClick={() => addToDoBoard("new task", "TO_DO", 1, story.story_id)}>Add new</button>
            </div>))}
          <button onClick={addStoryBoard} className="add-card-button">Add New</button>
      </div>

        <div className="column">
          <h1 className="board-heading">To Do</h1>
        {toDo.map(board => (
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
          {process.map(board => (
            <div className="cards">
              <h2>{board.desc}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">&gt;</button>
            </div>))}
          <button onClick={addProcessBoard} className="add-card-button">Add New</button>
      </div>

      <div className="column">
          <h1 className="board-heading">In Testing</h1>
          {testing.map(board => (
            <div className="cards">
              <h2>{board.desc}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">&gt;</button>
            </div>))}
          <button onClick={addValidationBoard} className="add-card-button">Add New</button>
      </div>

      <div className="column">
          <h1 className="board-heading">Done</h1>
          {done.map(board => (
            <div className="cards">
              <h2>{board.desc}</h2>
              <button className="card-button">Delete</button>
              <button className="card-button">&lt;</button>
              <button className="card-button">Done</button>
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

