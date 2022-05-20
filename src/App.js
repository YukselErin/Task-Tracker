import './App.css';
import React, { useState, useEffect } from "react"

const init = [
  {
    id: 0,
    name: "None",
    isActive: false,
    seconds: 0,
  },
]
const initActive = {
  id: 1,
  name: "Start A New Task",
  isActive: true,
  seconds: 0,
}
const TaskList = ({ allTasks, activeTask, setActiveTask, setAllTasks }) => {
  if(!allTasks){
    return (
      <h1> No previous tasks!</h1>
    )
  }
  return (
    <ul>
      {allTasks.map((item) => (
        <Task Task={item} allTasks={allTasks} activeTask={activeTask} setActiveTask={setActiveTask} setAllTasks={setAllTasks} />
      ))}
    </ul>
  )
}

const Task = ({ Task, allTasks, activeTask, setActiveTask, setAllTasks }) => {
  const handleOnClick = () => {
    //const index = allTasks.findIndex((element)=>element.name === Task.name)
    setAllTasks(allTasks.filter((element)=>element.name !== Task.name))
    if(activeTask.name){
      setAllTasks((prev)=> [...prev, activeTask])
    }
    setActiveTask(Task)
  }

  const handleDelete = () => {
    setAllTasks(allTasks.filter((element)=>element.name !== Task.name))
  }

  const minutes = Math.floor(Task.seconds / 60) > 0 && (" " + Math.floor(Task.seconds / 60) + " Minutes ")
  const hours = Math.floor(Task.seconds / 3600) > 0 && (Math.floor(Task.seconds / 3600) + "Hours")
  return (
    <div class ="task">
    <li key={Task.id}> {Task.name}:{hours} {minutes} {Math.floor(Task.seconds % 60)} Seconds  </li>
    <button  class="greenbutton" onClick={handleOnClick}> Restart Task</button>
    <button class ="redbutton" onClick={handleDelete}>Delete Task</button>
    </div>
  ) 
}

const ActiveTask = ({ setAllTasks, Task, setActiveTask }) => {
  const handleOnClik = () => {
    setAllTasks((prev) => [
      ...prev,
      Task
    ]);
    setActiveTask({})
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTask((prev) => {
        return { ...prev, seconds: prev.seconds + 1 }
      })
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(Task.seconds / 60) > 0 && (" " + Math.floor(Task.seconds / 60) + " Minutes ")
  const hours = Math.floor(Task.seconds / 3600) > 0 && (Math.floor(Task.seconds / 3600) + "Hours")
  if (!Task.name) { return <h1> No Active Tasks</h1> }
  return (
    <div>
      <h1>{Task.name}: {hours} {minutes} {Math.floor(Task.seconds % 60)} Seconds </h1>
      <button class = "redbutton" onClick={handleOnClik}>Stop Task</button>
    </div>
  )
}


const TaskForm = ({ allTasks, activeTask, setActiveTask, setAllTasks }) => {
  const [newTask, setNewTask] = useState({})

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setNewTask((prev) => ({
      ...prev,
      seconds: 0,
      [name]: value,
      id: Date.now()

    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(allTasks)
    console.log(activeTask)
    console.log(newTask)
    var test = false

    if(allTasks){
      test = allTasks.findIndex((element) => {return element.name === newTask.name }) === -1
      
    }
    else{
      test = true
    }
    
  
    const activeTest = activeTask.name === newTask.name
    if (!test || activeTest) {
      alert("This Task Already Exists")

    }
    else if(!newTask.name){
      alert("Must enter a valid task!")
    }
    else {
      if(activeTask.name){
        setAllTasks((prev) => [
          ...prev,
          activeTask
        ]);
      }
      setActiveTask(newTask)
      setNewTask({})
    }

  }


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start a new task: 
        <input type="text" name="name" onChange={handleChange} />
      </label>
      <input type="submit" value="Start" />
    </form>
  )
}

const App = () => {

  const [allTasks, setAllTasks] = useState(()=>{
    const storedAllTasks =  localStorage.getItem("AllTasks");
    const initialValue = JSON.parse(storedAllTasks);
    return initialValue || ""; 
})
  const [activeTask, setActiveTask] = useState(()=>{
    const storedActiveTasks =  localStorage.getItem("ActiveTasks");
    const initialValue = JSON.parse(storedActiveTasks);
    return initialValue|| ""; 
})

  useEffect(() =>(
    localStorage.setItem("ActiveTasks", JSON.stringify(activeTask))
  ),[activeTask])

  useEffect(()=>(
    localStorage.setItem("AllTasks", JSON.stringify(allTasks))
  ),[allTasks])
  
  return (
    <div className="App">
      <TaskForm allTasks={allTasks} activeTask={activeTask} setActiveTask={setActiveTask} setAllTasks={setAllTasks} />
      <ActiveTask setAllTasks={setAllTasks} Task={activeTask} setActiveTask={setActiveTask} />
      <TaskList allTasks={allTasks} activeTask={activeTask} setActiveTask={setActiveTask} setAllTasks={setAllTasks} />
    </div>
  );

}

export default App;
