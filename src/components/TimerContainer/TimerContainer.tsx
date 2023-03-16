import { useState, useEffect, useContext } from "react";
import { getTime, startStop, isRunning, setOnTimeout } from "../../util/clock";
import { Timer } from "../Timer/Timer";
import styles from "./TimerContainer.module.css";
import gearImage from "../../assets/gear.png";
import alarmSound from "../../assets/alarm.mp3";
import SettingType from "../../types/SettingType";
import { SettingContext } from "../../contexts/SettingsContext";

let focusDuration = 25;
let breakDuration = 10;

function addZero(num: string) {
    if (num.length == 1) num = "0" + num;
    if (num.length == 1) num = "0" + num;
    return num;
}

type TimerContainerProps = {
    toggleSettingsWindow(event: React.MouseEvent): void;
}

export function TimerContainer(props: TimerContainerProps) {

    const { settings, setSettings } = useContext(SettingContext);

    const focusSetting = settings.find(s => s.settingId == "focusDuration");
    const breakSetting = settings.find(s => s.settingId == "breakDuration");
    if (focusSetting && breakSetting) {
        focusDuration = focusSetting.currentValue as number;
        breakDuration = breakSetting.currentValue as number;
    }

    const [second, setSecond] = useState<string>("00");
    const [minute, setMinute] = useState<string>(addZero(focusDuration.toString()));
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        setOnTimeout(() => {
            setRunning(false);
        });
    }, []);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            let newSecond = getTime().second.toString();
            let newMinute = getTime().minute.toString();
            setSecond(addZero(newSecond));
            setMinute(addZero(newMinute));
        }, 1000);
    }, []);

    function onStartStopClick(event: React.MouseEvent) {
        setRunning(startStop());
    }

    return (
        <div className={styles["timer-container"]}>
            <Timer minute={minute} second={second}></Timer>
            <div className={styles["control"]}>
                <button onClick={onStartStopClick} className={styles["start-stop-button"]}>{running ? "Stop" : "Start"}</button>
                <button onClick={props.toggleSettingsWindow} className={styles["settings-button"]} style={{ background: `url(${gearImage})`, backgroundSize: "cover" }}></button>
            </div>
        </div>
    )
}