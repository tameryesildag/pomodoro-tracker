import { auth, getTasks, db } from "./api/firebase";
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

document.body.style.backgroundColor = "#222831";
document.body.style.margin = "0";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSettingsWindowOpen, setIsSettingsWindowOpen] = useState<boolean>(false);
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
    })
  }

  return (
    <div className="App">
      <SettingContextProvider>
        <Header loggedIn={loggedIn}></Header>
        <SettingsWindow closeWindow={toggleSettingsWindow} isOpen={isSettingsWindowOpen}></SettingsWindow>
        <main className={styles["content"]}>
          <TimerContainer toggleSettingsWindow={toggleSettingsWindow}></TimerContainer>
          <TaskContainer updateTasks={updateTasks} tasks={tasks}></TaskContainer>
        </main>
      </SettingContextProvider>
    </div>
  );
}

export default App;
