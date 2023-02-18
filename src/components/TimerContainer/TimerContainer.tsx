import { useState, useEffect } from "react";
import { getTime, startStop, isRunning} from "../../util/clock";
import { Timer } from "../Timer/Timer";
import styles from "./TimerContainer.module.css";
import gearImage from "../../assets/gear.png";
import alarmSound from "../../assets/alarm.mp3";

export function TimerContainer(){

    const [second, setSecond] = useState<string>("00");
    const [minute, setMinute] = useState<string>("25");
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            if(!isRunning()) return;
            let newSecond = getTime().second.toString();
            let newMinute = getTime().minute.toString();
            if(newSecond == "0" && newMinute == "0"){
                let audio = new Audio(alarmSound);
                audio.play();
                setRunning(false);  
            }
            if(newSecond.length == 1) newSecond = "0" + newSecond;
            if(newMinute.length == 1) newMinute = "0" + newMinute;
            setSecond(newSecond);
            setMinute(newMinute);
        }, 1000);
    }, []);

    function onStartStopClick(event:React.MouseEvent){
        setRunning(startStop());
    }

    return(
        <div className={styles["timer-container"]}>
            <Timer minute={minute} second={second}></Timer>
            <div className={styles["control"]}>
                <button onClick={onStartStopClick} className={styles["start-stop-button"]}>{running ? "Stop" : "Start"}</button>
                <button className={styles["settings-button"]} style={{background: `url(${gearImage})`, backgroundSize: "cover"}}></button>
            </div>
        </div>
    )
}