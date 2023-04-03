import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, updateDoc, setDoc, getDoc, arrayUnion, getDocFromServer } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Task from "../types/Task";
import User from "../types/User";

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

export const db = getFirestore();

const tasksCollection = collection(db, "tasks");

const usersCollection = collection(db, "users");

export function getTasks() {
    return new Promise<Task[]>(async (resolve, reject) => {
        if(!auth.currentUser){
            const item = localStorage.getItem("tasks");
            if(item){
                const tasks = JSON.parse(item) as Task[];
                tasks.sort((a, b) => {
                    return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime();
                });
                resolve(tasks);
            } else {
                resolve([]);
            }
        } else {
            const taskCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
            const tasksSnapshot = await getDocs(taskCollectionRef);
            const tasks = tasksSnapshot.docs.map((d) => {
                return {...d.data(), id: d.id} as Task;
            });
            tasks.sort((a, b) => {
                return (new Date(a.createdAt)).getTime() - (new Date(b.createdAt)).getTime();
            });
            resolve(tasks);
        }
    })
}

export function addTask(description: string) {
    return new Promise(async (resolve, reject) => {
        if (!auth.currentUser) {
            const item = localStorage.getItem("tasks");
            const newTask = {
                id: new Date().valueOf().toString(),
                description,
                createdAt: (new Date()).toISOString(),
                done: false
            };
            if(item){
                let tasks = JSON.parse(item) as Task[];
                tasks.push(newTask)
                localStorage.setItem("tasks", JSON.stringify(tasks));
                resolve(true);
            } else {
                let tasks:Task[] = [];
                tasks.push(newTask);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                resolve(true);
            }
        } else {
            await addDoc(collection(db, "users", auth.currentUser.uid, "tasks"), {
                description,
                createdAt: (new Date()).toISOString(),
                done: false
            })
            resolve(true);
        }
    })
}

export function deleteTask(taskId: string) {
    return new Promise((resolve, reject) => {
        if(!auth.currentUser) {
            getTasks().then(tasks => {
                const taskIndex = tasks.findIndex(t => {
                    return t.id == taskId;
                })
                tasks.splice(taskIndex, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                resolve(true);
            })
        } else {
            const docToDelete = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
            deleteDoc(docToDelete).then(() => {
                resolve(true);
            })
        }
    })
}

export function taskDone(taskId: string) {
    return new Promise((resolve, reject) => {
        if(!auth.currentUser) {
            getTasks().then(tasks => {
                const t = tasks.find(t => t.id == taskId);
                if(!t) return reject(new Error("Couldn't find the task with given ID."));
                t.done = true;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                resolve(true);
            });
        } else {
            const docToUpdate = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
            updateDoc(docToUpdate, { done: true }).then(() => {
                resolve(true);
            });
        }
    })

}

export function taskUndone(taskId: string) {
    return new Promise((resolve, reject) => {
        if(!auth.currentUser) {
            getTasks().then(tasks => {
                const t = tasks.find(t => t.id == taskId);
                if(!t) return reject(new Error("Couldn't find the task with given ID."));
                t.done = false;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                resolve(true);
            });
        } else {
            const docToUpdate = doc(db, "users", auth.currentUser.uid, "tasks", taskId);
            updateDoc(docToUpdate, { done: false }).then(() => {
                resolve(true);
            });
        }
    })
}

export const provider = new GoogleAuthProvider();

export const auth = getAuth();

export function login() {
    signInWithPopup(auth, provider).then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
    }).catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    })
}