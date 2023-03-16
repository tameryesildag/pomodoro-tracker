import SettingType from "../types/SettingType"

export const defaultSettings: SettingType[] = [
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

export function getSetting(settingId:string){
    if(localStorage.getItem("settings")){
        const settings = JSON.parse(localStorage.getItem("settings") as string) as SettingType[];
        const setting = settings.find(s => s.settingId == settingId);
        if(setting){
            return setting;
        } else {
            console.log(new Error(`Setting "${settingId}" is not found in settings.`));
        }
    } else {
        console.log(new Error("Settings are not found in local storage."));
        return;
    }
}