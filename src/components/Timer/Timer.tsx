import styles from "./Timer.module.css";

type TimerProp = {
    minute: string;
    second: string;
}

export function Timer(prop:TimerProp){

    return(
        <div className={styles["timer"]}>
            {prop.minute}:{prop.second}
        </div>
    )
}