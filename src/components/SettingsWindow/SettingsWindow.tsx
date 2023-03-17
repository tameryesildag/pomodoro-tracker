import styles from "./SettingsWindow.module.css";
import closeIcon from "../../assets/close.png";
import Setting from "../Setting/Setting";
import { useRef, useState, useContext } from "react";
import SettingType from "../../types/SettingType";
import { defaultSettings } from "../../util/settings";
import { SettingContext } from "../../contexts/SettingsContext";

type SettingsWindowProp = {
    isOpen: boolean;
    closeWindow: Function;
}

export function SettingsWindow(props: SettingsWindowProp) {

    const {settings, setSettings} = useContext(SettingContext);

    //const [tempSettings, setTempSettings] = useState<SettingType[]>(settings);

    function onCloseClick() {
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