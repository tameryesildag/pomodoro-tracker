import styles from "./SettingsWindow.module.css";
import closeIcon from "../../assets/close.png";
import Setting from "../Setting/Setting";
import { useRef, useState } from "react";
import SettingType from "../../types/SettingType";

type SettingsWindowProp = {
    isOpen: boolean;
    closeWindow: Function;
}

const defaultSettings: SettingType[] = [
    {
        settingId: "focusDuration",
        settingName: "Focus duration (minutes)",
        defaultValue: 25,
        currentValue: 25,
        type: "number"
    },
    {
        settingId: "breakDuration",
        settingName: "Break Duration (minutes)",
        defaultValue: 10,
        currentValue: 10,
        type: "number"
    },
    {
        settingId: "alarmOn",
        settingName: "Alarm",
        defaultValue: true,
        currentValue: true,
        type: "boolean"
    },
    {
        settingId: "autoStart",
        settingName: "Start next timer automatically",
        defaultValue: false,
        currentValue: false,
        type: "boolean"
    }
]

let initialSettings = defaultSettings;

export function SettingsWindow(props: SettingsWindowProp) {

    if (localStorage.getItem("settings")){
        initialSettings = JSON.parse(localStorage.getItem("settings") as string); 
    }

    const [settings, setSettings] = useState<SettingType[]>(initialSettings);

    function onCloseClick() {
        localStorage.setItem("settings", JSON.stringify(settings));
        props.closeWindow();
    }

    function changeSetting(settingId:string, newValue: string) {
        setSettings(oldSettings => {
            let settingIndex = oldSettings.findIndex(s => s.settingId == settingId);
            let newSettings = oldSettings.slice();
            if(oldSettings[settingIndex].type == "number"){
                newSettings[settingIndex].currentValue = parseInt(newValue);
            } else {
                newSettings[settingIndex].currentValue = newValue;
            }
            return newSettings;
        });
        console.log(settings);
    }

    return (
        <div style={{ display: props.isOpen ? "flex" : "none" }} className={styles["settings-window-container"]}>
            <div className={styles["settings-window"]}>
                <div className={styles["window-control"]}>
                    <div className={styles["window-title"]}>Settings</div>
                    <div onClick={onCloseClick} className={styles["window-close-button"]}>
                        <img className={styles["close-button-image"]} src={closeIcon}></img>
                    </div>
                </div>
                <div className={styles["settings-container"]}>
                    {settings.map((s, i) => {
                        return (
                            <Setting key={i} changeSetting={changeSetting} setting={s}></Setting>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}