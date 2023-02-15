import React, { FormEvent, FormEventHandler, useRef } from "react";
import { addTask } from "../../api/firebase";
import styles from "./TaskCardInput.module.css";

type TaskCardInputProps = {
    updateTasks: Function;
}

export default function TaskCardInput(props:TaskCardInputProps){

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    function onKeyDown(event:React.KeyboardEvent<HTMLTextAreaElement>){
        const element = event.target as HTMLTextAreaElement;
        if(event.key == "Enter"){
            if(descriptionRef.current == null) return;
            addTask(descriptionRef.current.value).then(() => {
                props.updateTasks();
                element.value = "";
            });
        }
    }

    return(
        <textarea ref={descriptionRef} onKeyDown={onKeyDown} className={styles["task-input"]} placeholder="Create a new task"></textarea>
    )
}