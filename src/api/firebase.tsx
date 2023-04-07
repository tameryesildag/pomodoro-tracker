import { initializeApp, getApps } from "firebase/app";
import { getFirestore, query, collection, doc, getDocs, addDoc, deleteDoc, updateDoc, setDoc, getDoc, arrayUnion, getDocFromServer, orderBy, limit, where } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Task from "../types/Task";
import User from "../types/User";
import { formatDate } from "../util/date";
import Day from "../types/Day";
import moment from "moment";

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

export async function addMinute(){
    if(!auth.currentUser){
        return;
    } else {
        const daysDoc = doc(db, "users", auth.currentUser.uid, "days", formatDate(new Date()));
        const docSnap = await getDoc(daysDoc);
        if(docSnap.exists()){
            let oldMinutes = docSnap.data().minutes | 0;
            updateDoc(daysDoc, {minutes: oldMinutes + 1});
        } else {
            setDoc(daysDoc, {date: new Date(), minutes: 1});
        }
    }
}

export function getDays(){
    return new Promise<Day[]>(async (resolve, reject) => {
        if(!auth.currentUser){
            reject(new Error("User not logged in."));
        } else {
            const daysCollection = collection(db, "users", auth.currentUser.uid, "days");
            const thirtyDaysAgo = moment().subtract(30, "days");
            const daysQuery = query(daysCollection, orderBy("date", "desc"), limit(30), where("date", ">=", thirtyDaysAgo.toDate()));

            const querySnapshot = await getDocs(daysQuery);

            let days:Day[] = [];
            
            for(let i = 0; i < 10; i++){
                days.push(
                    {
                        date: moment().subtract(i, "days").toDate(),
                        minutes: 0
                    }
                )
            }

            querySnapshot.forEach(doc => {
                const day = days.find(d => {
                    let moment1 = moment(d.date);
                    let moment2 = moment(new Date(doc.data().date.seconds * 1000));
                    return moment1.isSame(moment2, "day");
                })
                if(day){
                    day.minutes = doc.data().minutes;
                }
            });
            
            days = days.reverse();

            resolve(days);
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