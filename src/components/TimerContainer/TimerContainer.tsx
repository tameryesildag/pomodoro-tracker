import { useState, useEffect, useContext } from "react";
import * as clock from "../../util/clock";
import { Timer } from "../Timer/Timer";
import styles from "./TimerContainer.module.css";
import gearImage from "../../assets/gear.png";
import nextImage from "../../assets/next.png";
import chartImage from "../../assets/chart.png";
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
    toggleDataWindow(event: React.MouseEvent): void;
}

type eventType = "break" | "focus" | "longbreak";

export function TimerContainer(props: TimerContainerProps) {

    const { settings, setSettings } = useContext(SettingContext);

    const focusSetting = settings.find(s => s.settingId == "focusDuration");

    if (focusSetting) {
        focusDuration = focusSetting.currentValue as number;
    }

    const [second, setSecond] = useState<string>("00");
    const [minute, setMinute] = useState<string>(addZero(focusDuration.toString()));
    const [running, setRunning] = useState<boolean>(false);
    //const [onBreak, setOnBreak] = useState<boolean>(false);

    const [currentEvent, setCurrentEvent] = useState<eventType>("focus");

    function updateTime() {
        let newSecond = clock.getTime().second.toString();
        let newMinute = clock.getTime().minute.toString();
        setSecond(addZero(newSecond));
        setMinute(addZero(newMinute));
    }

    useEffect(() => {
        clock.setOnTimeout(() => {
            setRunning(false);
            setCurrentEvent(clock.currentEvent);
            updateTime();
        });
        clock.setOnSkip(() => {
            setRunning(false);
            setCurrentEvent(clock.currentEvent);
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



    if (currentEvent == "break") {
        document.title = addZero(minute) + ":" + addZero(second) + " - Break";
    } else if (currentEvent == "longbreak") {
        document.title = addZero(minute) + ":" + addZero(second) + " - Long Break";
    } else {
        document.title = addZero(minute) + ":" + addZero(second) + " - Focus";
    }

    return (
        <div className={styles["timer-container"]}>
            <div className={styles["states-container"]}>
                <div style={{ opacity: currentEvent == "focus" ? 1 : 0.5 }} className={styles["state"]}>Focus</div>
                <div style={{ opacity: currentEvent == "break" ? 1 : 0.5 }} className={styles["state"]}>Break</div>
                <div style={{ opacity: currentEvent == "longbreak" ? 1 : 0.5 }} className={styles["state"]}>Long Break</div>
            </div>
            <Timer minute={minute} second={second}></Timer>
            <div className={styles["control"]}>
                <button onClick={onStartStopClick} className={styles["start-stop-button"]}>{running ? "Pause" : "Start"}</button>
                <button title="Skip" onClick={onSkipClick} className={styles["skip-button"]}><img className={styles["skip-image"]} src={nextImage}></img></button>
                <button title="Settings" onClick={props.toggleSettingsWindow} className={styles["image-button"]} style={{ background: `url(${gearImage})`, backgroundSize: "cover" }}></button>
                <button title="Data" onClick={props.toggleDataWindow} className={styles["image-button"]} style={{ background: `url(${chartImage})`, backgroundSize: "cover" }}></button>
            </div>
        </div>
    )
}