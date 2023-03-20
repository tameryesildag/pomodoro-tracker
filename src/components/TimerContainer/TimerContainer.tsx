import { useState, useEffect, useContext } from "react";
import * as clock from "../../util/clock";
import { Timer } from "../Timer/Timer";
import styles from "./TimerContainer.module.css";
import gearImage from "../../assets/gear.png";
import nextImage from "../../assets/next.png";
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

    if (focusSetting) {
        focusDuration = focusSetting.currentValue as number;
    }

    const [second, setSecond] = useState<string>("00");
    const [minute, setMinute] = useState<string>(addZero(focusDuration.toString()));
    const [running, setRunning] = useState<boolean>(false);
    const [onBreak, setOnBreak] = useState<boolean>(false);

    function updateTime() {
        let newSecond = clock.getTime().second.toString();
        let newMinute = clock.getTime().minute.toString();
        setSecond(addZero(newSecond));
        setMinute(addZero(newMinute));
    }

    useEffect(() => {
        clock.setOnTimeout(() => {
            setRunning(false);
            setOnBreak(clock.onBreak);
            updateTime();
        });
        clock.setOnSkip(() => {
            setRunning(false);
            setOnBreak(clock.onBreak);
            updateTime();
        });
        clock.setOnTick(() => {
            updateTime();
        });
    }, []);

    function onStartStopClick(event: React.MouseEvent) {
        setRunning(clock.startStop());
    }

    function onSkipClick(event: React.MouseEvent) {
        clock.skip();
    }

    return (
        <div className={styles["timer-container"]}>
            <div className={styles["states-container"]}>
                <div style={{opacity: onBreak ? "0.5" : 1}} className={styles["state"]}>Focus</div>
                <div style={{opacity: !onBreak ? "0.5" : 1}} className={styles["state"]}>Break</div>
            </div>
            <Timer minute={minute} second={second}></Timer>
            <div className={styles["control"]}>
                <button onClick={onStartStopClick} className={styles["start-stop-button"]}>{running ? "Pause" : "Start"}</button>
                <button title="Skip" onClick={onSkipClick} className={styles["skip-button"]}><img className={styles["skip-image"]} src={nextImage}></img></button>
                <button title="Settings" onClick={props.toggleSettingsWindow} className={styles["settings-button"]} style={{ background: `url(${gearImage})`, backgroundSize: "cover" }}></button>
            </div>
        </div>
    )
}