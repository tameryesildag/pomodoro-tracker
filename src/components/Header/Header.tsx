import { auth, login } from "../../api/firebase";
import styles from "./Header.module.css";

type HeaderProps = {
    loggedIn: boolean;
}

export function Header(props: HeaderProps) {



    function loginLogout(event: React.MouseEvent) {
        if (auth.currentUser) {
            auth.signOut();
        } else {
            login();
        }
    }

    return (
        <div className={styles["header"]}>
            {auth.currentUser ? <div className={styles["name"]}>{auth.currentUser.displayName}</div> : null}
            <div onClick={loginLogout} className={styles["login-button"]}>
                {props.loggedIn ? "Log out" : "Login"}
            </div>
        </div>
    )
}