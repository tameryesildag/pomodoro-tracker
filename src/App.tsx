import {getTasks} from "./api/firebase";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Task from "./types/Task";
import { TimerContainer } from "./components/TimerContainer/TimerContainer";

document.body.style.backgroundColor = "#222831";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
      getTasks().then(tasks => {
        console.log("tasks has been loaded.");
        setTasks(tasks);
      })
  }, []);

  function updateTasks(){
    getTasks().then(tasks => {
      console.log("tasks has been updated.");
      setTasks(tasks);
    })
  }

  return (
    <div className="App">
      <main className={styles["content"]}>
        <TimerContainer></TimerContainer>
        <TaskContainer updateTasks={updateTasks} tasks={tasks}></TaskContainer>
      </main>
    </div>
  );
}

export default App;
