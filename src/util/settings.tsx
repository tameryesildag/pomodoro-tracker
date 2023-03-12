import SettingType from "../types/SettingType"

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