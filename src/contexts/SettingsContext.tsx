import {createContext, useState} from "react";
import SettingType from "../types/SettingType";
import { defaultSettings } from "../util/settings";


export const SettingContext = createContext<{settings: SettingType[], setSettings: React.Dispatch<React.SetStateAction<SettingType[]>>}>({settings: defaultSettings, setSettings: (()=>{})});

type providerProps = {
    children: React.ReactNode;
}

export const SettingContextProvider = (props: providerProps) => {

    const [settings, setSettings] = useState<SettingType[]>(defaultSettings);

    localStorage.setItem("settings", JSON.stringify(settings));

    return(
        <SettingContext.Provider value={{settings, setSettings}}>{props.children}</SettingContext.Provider>
    )
}