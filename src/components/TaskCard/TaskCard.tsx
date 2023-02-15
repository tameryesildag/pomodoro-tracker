import Task from "../../types/Task"
import styles from "./TaskCard.module.css";
import {useState} from "react";
import { deleteTask, taskDone, taskUndone } from "../../api/firebase";

type TaskCardProp = {
    task:Task;
    updateTasks: Function;
}

export default function TaskCard(props:TaskCardProp){

    const [menuDisplay, setMenuDisplay] = useState<string>("none"); 

    function onThreeDotsClick(event:React.MouseEvent){
        if(menuDisplay == "none") setMenuDisplay("flex");
        else setMenuDisplay("none");
    }

    function onDeleteClick(event:React.MouseEvent){
        deleteTask(props.task.id);
        props.updateTasks();
        setMenuDisplay("none");
    }

    function onDoneClick(event:React.MouseEvent){
        props.task.done ? taskUndone(props.task.id) : taskDone(props.task.id);
        props.updateTasks();
        setMenuDisplay("none");
    }

    return(
        <div className={styles["task-card"]}>
            <div style={{"textDecoration": props.task.done ? "line-through" : "none"}} className={styles["task-description"]}>
                {props.task.description}
            </div>
            <div className={styles["card-menu"]}>
                <div onClick={onThreeDotsClick} className={styles["three-dots"]}>⋮</div>
                <div style={{"display": menuDisplay}} className={styles["dropdown"]}>
                    <div onClick={onDoneClick} className={styles["dropdown-option"]}>Mark as {props.task.done ? "undone" : "done"}</div>
                    <div onClick={onDeleteClick} className={styles["dropdown-option"]}>Delete</div>
                </div>
            </div>
        </div>
    )

}