import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Task from "../types/Task";

const firebaseConfig = {
  apiKey: "AIzaSyA6POHcbHes2sfBNK08MjEIFPyQz6KGtGg",
  authDomain: "pomodoro-dca2b.firebaseapp.com",
  projectId: "pomodoro-dca2b",
  storageBucket: "pomodoro-dca2b.appspot.com",
  messagingSenderId: "359926179126",
  appId: "1:359926179126:web:91cb391000dae5a829ff97",
  measurementId: "G-T10GY27222",
};

export const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore();
  
const tasksCollection = collection(db, "tasks");

export function getTasks(){
    return new Promise<Task[]>((resolve, reject) => {
        getDocs(tasksCollection).then((snapshot) => {
            const tasks:Task[] = [];
            snapshot.docs.forEach(doc => {
                tasks.push(({...doc.data(), id: doc.id}) as Task)
            })
            tasks.sort((a, b) => {
                return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime();
            })
            return resolve(tasks);
        })
    })
}

export function addTask(description:string){
    return new Promise((resolve, reject) => {
        addDoc(tasksCollection, {createdAt: (new Date()).toISOString(), description, done:false}).then(() => {
            resolve(true);
        });
    })
}

export function deleteTask(taskId:string){
    return new Promise((resolve, reject) => {
        const docToDelete = doc(db, "tasks", taskId);
        deleteDoc(docToDelete).then(()=> {
            resolve(true);
        })
    })
}

export function taskDone(taskId:string){
    return new Promise((resolve, reject) => {
        const docToUpdate = doc(db, "tasks", taskId);
        updateDoc(docToUpdate, {done:true}).then(()=> {
            resolve(true);
        });
    })

}

export function taskUndone(taskId:string){
    return new Promise((resolve, reject) => {
        const docToUpdate = doc(db, "tasks", taskId);
        updateDoc(docToUpdate, {done:false}).then(()=> {
            resolve(true);
        });
    })
}