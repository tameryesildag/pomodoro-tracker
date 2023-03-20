import { getSetting } from "./settings";
import alarmSound from "../assets/alarm.mp3";

const alarmAudio = new Audio(alarmSound);

export let focusDuration: number = 25;

export let breakDuration: number = 10;

updateDurations();

let minute: number = focusDuration;

let second: number = 0;

let running: boolean = false;

export let onBreak: boolean = false;

let onTimeout: Function = () => {};

let onSkip: Function = () => {};

let onTick: Function = () => {};

let timeoutId:NodeJS.Timeout;

export function setOnTimeout(func: Function) {
    onTimeout = func;
}

export function setOnSkip(func: Function){
    onSkip = func;
}

export function setOnTick(func: Function){
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
}

export function tick() {
    if (!running) return;
    onTick();
    if (minute <= 0 && second <= 0) {
        running = false;
        onBreak = !onBreak;
        if (onBreak) minute = breakDuration;
        else minute = focusDuration;
        alarmAudio.play();
        updateDurations();
        onTimeout();
        return;
    }
    if (second === 0) {
        second = 59
        minute = minute - 1;
        timeoutId = setTimeout(tick, 1000);
        return;
    } else {
        second = second - 1;
        timeoutId = setTimeout(tick, 1000);
        return;
    }
}

export function startStop() {
    if(timeoutId) clearTimeout(timeoutId);
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

export function skip(){
    if(onBreak){
        setTime(focusDuration, 0);
        onBreak = false;
    } else {
        setTime(breakDuration, 0);
        onBreak = true;
    }
    running = false;
    if(timeoutId) clearTimeout(timeoutId);
    updateDurations();
    onSkip();
}