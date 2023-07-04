import { auth, getTasks, db, getDays } from "./api/firebase";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./App.module.css";
import TaskContainer from "./components/TaskContainer/TaskContainer";
import Task from "./types/Task";
import { TimerContainer } from "./components/TimerContainer/TimerContainer";
import { SettingsWindow } from "./components/SettingsWindow/SettingsWindow";
import "./assets/bootstrap.min.css";
import { Header } from "./components/Header/Header";
import { onAuthStateChanged } from "firebase/auth";
import User from "./types/User";
import { setDoc, doc } from "firebase/firestore";
import { SettingContextProvider } from "./contexts/SettingsContext";
import DataWindow from "./components/DataWindow/DataWindow";

document.body.style.backgroundColor = "#222831";
document.body.style.margin = "0";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSettingsWindowOpen, setIsSettingsWindowOpen] = useState<boolean>(false);
  const [isDataWindowOpen, setIsDataWindowOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  function updateTasks() {
    getTasks().then(tasks => {
      setTasks(tasks);
    }).catch(err => {
      console.log(err);
      setTasks([]);
    })
  }

  useEffect(() => {
    getTasks().then(tasks => {
      setTasks(tasks);
    }).catch((err) => {
      console.log(err);
      setTasks([]);
    })

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setTasks([]);
        setLoggedIn(false);
        updateTasks();
      } else {
        setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
        }, { merge: true }).then(() => {
          updateTasks();
          setLoggedIn(true);
        });
      }
    })

    document.title = "Pomodoro Tracker";

  }, []);

  function toggleSettingsWindow(event: React.MouseEvent) {
    setIsSettingsWindowOpen(s => {
      return !s;
    });
  }

  function toggleDataWindow(event: React.MouseEvent) {
    if(!auth.currentUser) return alert("Log in to keep track of your progress.")
    setIsDataWindowOpen(s => {
      return !s;
    });
  }

  function changeTaskIndex(oldIndex:number, newIndex: number){
    let newTasks:Task[] =  [...tasks];
    let taskToMove = newTasks[oldIndex];
    newTasks.splice(oldIndex, 1);
    newTasks.splice(newIndex, 0, taskToMove);
    setTasks(newTasks);
  }

  return (
    <div className="App">
      <SettingContextProvider>
        <Header loggedIn={loggedIn}></Header>
        <SettingsWindow closeWindow={toggleSettingsWindow} isOpen={isSettingsWindowOpen}></SettingsWindow>
        {auth.currentUser ? <DataWindow closeWindow={toggleDataWindow} isOpen={isDataWindowOpen}></DataWindow> : null}
        <main className={styles["content"]}>
          <TimerContainer toggleDataWindow={toggleDataWindow} toggleSettingsWindow={toggleSettingsWindow}></TimerContainer>
          <TaskContainer changeTaskIndex={changeTaskIndex} updateTasks={updateTasks} tasks={tasks}></TaskContainer>
        </main>
      </SettingContextProvider>
    </div>
  );
}

export default App;
