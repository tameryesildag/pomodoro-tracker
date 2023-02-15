import { JsxElement } from "typescript"
import Task from "../../types/Task"
import TaskCard from "../TaskCard/TaskCard"
import TaskCardInput from "../TaskCardInput/TaskCardInput";
import styles from "./TaskContainer.module.css";

type TaskContainerProp = {
    tasks: Task[];
    updateTasks: Function;
}

export default function TaskContainer(props:TaskContainerProp){
    return(
        <div className={styles["task-container"]}>
            <div className={styles["container-title"]}>Tasks</div>
            {props.tasks.map((task, i) => {
                return(<TaskCard key={i} updateTasks={props.updateTasks} task={task}></TaskCard>)
            })}
            <TaskCardInput updateTasks={props.updateTasks}></TaskCardInput>
        </div> 
    )
}