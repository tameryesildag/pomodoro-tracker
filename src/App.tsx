import {getTasks} from "./api/firebase";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Task from "./types/Task";

document.body.style.backgroundColor = "#222831";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
      getTasks().then(tasks => {
        setTasks(tasks);
      })
  }, []);

  function updateTasks(){
    getTasks().then(tasks => {
      setTasks(tasks);
    })
  }

  return (
    <div className="App">
      <main className={styles["content"]}>
        <TaskContainer updateTasks={updateTasks} tasks={tasks}></TaskContainer>
      </main>
    </div>
  );
}

export default App;
