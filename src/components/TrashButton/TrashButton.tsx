import styles from "./TrashButton.module.css";
import trashIcon from "../../assets/trashcan.svg";

type TrashButtonProps = {
    deleteAllTasks: any;
}

export default function TrashButton(props:TrashButtonProps){

    return(
        <button className={styles["trash-button"]} onClick={props.deleteAllTasks}>
            Clear Tasks
        </button>
    )
}