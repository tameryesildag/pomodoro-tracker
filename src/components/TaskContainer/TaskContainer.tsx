import { JsxElement } from "typescript"
import Task from "../../types/Task"
import TaskCard from "../TaskCard/TaskCard"
import TaskCardInput from "../TaskCardInput/TaskCardInput";
import styles from "./TaskContainer.module.css";
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd";

type TaskContainerProp = {
    tasks: Task[];
    updateTasks: Function;
    changeTaskIndex: Function;
}

export default function TaskContainer(props: TaskContainerProp) {

    const onDragEnd:OnDragEndResponder = (result) => {
        if(!result.destination) return;
        if(result.destination.index == result.source.index) return;
        props.changeTaskIndex(result.source.index, result.destination.index);
    }

    return (
        <div className={styles["task-container"]}>
            <div className={styles["container-title"]}>Tasks</div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-1">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {props.tasks.map((task, i) => {
                                return (<TaskCard index={i} key={i} updateTasks={props.updateTasks} task={task}></TaskCard>)
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <TaskCardInput updateTasks={props.updateTasks}></TaskCardInput>
            </DragDropContext>
        </div>
    )
}