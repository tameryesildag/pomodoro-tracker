import { getSetting } from "./settings";
import alarmSound from "../assets/alarm.mp3";

const alarmAudio = new Audio(alarmSound); 

let focusTime:number = 25;

let breakTime:number = 10;

const focusSetting = getSetting("focusDuration");

if (focusSetting) {
    focusTime = focusSetting.currentValue as number;
}

const breakSetting = getSetting("breakDuration");

if (breakSetting) {
    breakTime = breakSetting.currentValue as number;
}

let minute: number = focusTime;

let second: number = 0;

let running: boolean = false;

let onBreak: boolean = false;

let onTimeout:Function = () => void 0;

export function tick() {
    if (!running) return;
    if (minute <= 0 && second <= 0) {
        running = false;
        onBreak = !onBreak;
        console.log(onBreak, breakTime);
        if(onBreak) minute = breakTime;
        else minute = focusTime;
        alarmAudio.play();
        onTimeout();
        return;
    }
    if (second === 0) {
        second = 59
        minute = minute - 1;
        setTimeout(tick, 1000);
        return;
    } else {
        second = second - 1;
        setTimeout(tick, 1000);
        return;
    }
}

export function startStop() {
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

export function setOnTimeout(func:Function){
    onTimeout = func;
}