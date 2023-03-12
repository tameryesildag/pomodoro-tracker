type SettingType = {
    settingId: string;
    settingName: string;
    defaultValue: string | number | boolean;
    currentValue: string | number | boolean;
    type: "number" | "string" | "boolean";
};

export default SettingType;