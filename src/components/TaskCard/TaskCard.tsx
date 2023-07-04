import Task from "../../types/Task"
import styles from "./TaskCard.module.css";
import { useState } from "react";
import { deleteTask, taskDone, taskUndone } from "../../api/firebase";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProp = {
    task: Task;
    updateTasks: Function;
    index: number;
}

export default function TaskCard(props: TaskCardProp) {

    const [menuDisplay, setMenuDisplay] = useState<string>("none");

    function onThreeDotsClick(event: React.MouseEvent) {
        if (menuDisplay == "none") setMenuDisplay("flex");
        else setMenuDisplay("none");
    }

    function onDeleteClick(event: React.MouseEvent) {
        deleteTask(props.task.id).then(() => {
            props.updateTasks();
        });
        setMenuDisplay("none");
    }

    function onDoneClick(event: React.MouseEvent) {
        props.task.done ? taskUndone(props.task.id).then(() => props.updateTasks()) : taskDone(props.task.id).then(() => props.updateTasks());
        setMenuDisplay("none");
    }

    return (
        <Draggable key={props.task.id} draggableId={props.task.id} index={props.index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={styles["task-card"]}>
                    <div style={{ "textDecoration": props.task.done ? "line-through" : "none" }} className={styles["task-description"]}>
                        {props.task.description}
                    </div>
                    <div className={styles["card-menu"]}>
                        <div onClick={onThreeDotsClick} className={styles["three-dots"]}>⋮</div>
                        <div style={{ "display":menuDisplay }} className={styles["dropdown"]}>
                            <div onClick={onDoneClick} className={styles["dropdown-option"]}>Mark as {props.task.done ? "undone" : "done"}</div>
                            <div onClick={onDeleteClick} className={styles["dropdown-option"]}>Delete</div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    )

}