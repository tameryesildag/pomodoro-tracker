import { getSetting } from "./settings";
import alarmSound from "../assets/alarm.mp3";
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'worker-timers';
import { addMinute } from "../api/firebase";

const alarmAudio = new Audio(alarmSound);

export let focusDuration: number = 25;

export let breakDuration: number = 10;

export let longBreakDuration: number = 30;

updateDurations();

let minute: number = focusDuration;

let second: number = 0;

let running: boolean = false;

export let currentEvent: "break" | "focus" | "longbreak" = "focus";

let onTimeout: Function = () => { };

let onSkip: Function = () => { };

let onTick: Function = () => { };

let timeoutId: number;

let pomodoroCount = 0;

export function setOnTimeout(func: Function) {
    onTimeout = func;
}

export function setOnSkip(func: Function) {
    onSkip = func;
}

export function setOnTick(func: Function) {
    onTick = func;
}

function updateDurations() {
    const focusSetting = getSetting("focusDuration");
    if (focusSetting) {
        focusDuration = focusSetting.currentValue as number;
    }
    const breakSetting = getSetting("breakDuration");
    if (breakSetting) {
        breakDuration = breakSetting.currentValue as number;
    }
    const longBreakSetting = getSetting("longBreakDuration");
    if (longBreakSetting) {
        longBreakDuration = longBreakSetting.currentValue as number;
    }
}

export function tick() {
    if (!running) return;
    onTick();
    if (minute <= 0 && second <= 0) {
        running = false;
        skip();

        const alarmSetting = getSetting("alarmOn");
        if(alarmSetting){
            if(alarmSetting.currentValue){
                alarmAudio.play();
            }
        } else {
            alarmAudio.play();
        }
        
        updateDurations();
        onTimeout();
        return;
    }
    if (second === 0) {
        second = 59
        minute = minute - 1;
        timeoutId = setTimeout(tick, 1000);
        if(currentEvent == "focus") addMinute();
        return;
    } else {
        second = second - 1;
        timeoutId = setTimeout(tick, 1000);
        return;
    }
}

export function startStop() {
    if (timeoutId) clearTimeout(timeoutId);
    running = !running;
    tick();
    return running;
}

export function getTime() {
    return ({ second, minute });
}

export function setTime(newMinute: number, newSecond: number) {
    minute = newMinute;
    second = newSecond;
}

export function isRunning() {
    return running;
}

export function skip() {

    if (currentEvent == "break" || currentEvent == "longbreak") {
        currentEvent = "focus";
        setTime(focusDuration, 0);
    } else if (currentEvent == "focus") {
        pomodoroCount += 1;
        if (pomodoroCount >= 4) {
            currentEvent = "longbreak";
            setTime(longBreakDuration, 0);
            pomodoroCount = 0;
        } else {
            currentEvent = "break";
            setTime(breakDuration, 0);
            minute = breakDuration;
        }
    }

    running = false;
    if (timeoutId) clearTimeout(timeoutId);
    updateDurations();
    onSkip();
}