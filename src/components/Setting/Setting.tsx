import styles from "./Setting.module.css";
import { Form } from "react-bootstrap"
import { useRef } from "react";
import SettingType from "../../types/SettingType";

type SettingProps = {
    setting: SettingType;
    changeSetting: Function;
}

export default function Setting(props: SettingProps) {

    function onInputChange(event:React.ChangeEvent<HTMLInputElement>){
        if(props.setting.type == "boolean"){
            props.changeSetting(props.setting.settingId, event.target.checked);
        } else {
            props.changeSetting(props.setting.settingId, event.target.value);
        }
    }

    return (
        <div className={styles["setting"]}>
            <div className={styles["setting-text"]}>{props.setting.settingName}</div>
            {(() => {
                if (props.setting.type == "boolean") {
                    return <Form.Check onChange={onInputChange} defaultChecked={props.setting.currentValue ? true : false} type="switch" className={styles["setting-switch"]}></Form.Check>
                } else {
                    return (
                        <div className={styles["input-container"]}>
                            <Form.Control onChange={onInputChange} value={props.setting.currentValue.toString()} className={styles["setting-text-input"]}></Form.Control>
                        </div>
                    );
                }
            })()}

        </div>
    )
}