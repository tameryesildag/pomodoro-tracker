import { useState, useEffect } from "react";
import { getTime, startStop, isRunning, setOnTimeout} from "../../util/clock";
import { Timer } from "../Timer/Timer";
import styles from "./TimerContainer.module.css";
import gearImage from "../../assets/gear.png";
import alarmSound from "../../assets/alarm.mp3";
import SettingType from "../../types/SettingType";

type TimerContainerProps = {
    toggleSettingsWindow(event:React.MouseEvent): void; 
}

let focusDuration = 25;
let breakDuration = 10;

export function TimerContainer(props:TimerContainerProps){

    if(localStorage.getItem("settings")){
        const settings = JSON.parse(localStorage.getItem("settings") as string) as SettingType[];
        const focusSetting = settings.find(s => s.settingId == "focusDuration");
        const breakSetting = settings.find(s => s.settingId == "breakDuration");
        if(focusSetting && breakSetting){
            focusDuration = focusSetting.currentValue as number;
            breakDuration = breakSetting.currentValue as number;
        }
    }

    const [second, setSecond] = useState<string>("00");
    const [minute, setMinute] = useState<string>(focusDuration.toString());
    const [running, setRunning] = useState<boolean>(false);

    setOnTimeout(() => {
        setRunning(false);
    });

    useEffect(() => {
        const timeInterval = setInterval(() => {
            let newSecond = getTime().second.toString();
            let newMinute = getTime().minute.toString();
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
                <button onClick={props.toggleSettingsWindow} className={styles["settings-button"]} style={{background: `url(${gearImage})`, backgroundSize: "cover"}}></button>
            </div>
        </div>
    )
}