import SettingType from "./SettingType";
import Task from "./Task";

type User = {
    name: string;
    email: string;
    tasks: Task[];
    settings: SettingType[];
}

export default User;