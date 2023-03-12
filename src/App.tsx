import {getTasks} from "./api/firebase";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Task from "./types/Task";
import { TimerContainer } from "./components/TimerContainer/TimerContainer";
import { SettingsWindow } from "./components/SettingsWindow/SettingsWindow";
import "./assets/bootstrap.min.css";

document.body.style.backgroundColor = "#222831";
document.body.style.margin = "0";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSettingsWindowOpen, setIsSettingsWindowOpen] = useState<boolean>(false);

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

  function toggleSettingsWindow(event:React.MouseEvent){
    setIsSettingsWindowOpen(s => {
      return !s;
    })
  }

  return (
    <div className="App">
      <SettingsWindow closeWindow={toggleSettingsWindow} isOpen={isSettingsWindowOpen}></SettingsWindow>
      <main className={styles["content"]}>
        <TimerContainer toggleSettingsWindow={toggleSettingsWindow}></TimerContainer>
        <TaskContainer updateTasks={updateTasks} tasks={tasks}></TaskContainer>
      </main>
    </div>
  );
}

export default App;
