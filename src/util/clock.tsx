let minute:number = 0;

let second:number = 10;

let running:boolean = false;

export function tick(){
        if(!running) return;
        if(minute <= 0 && second <= 0){
            running = false;
            return;
        }
        if(second === 0){
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

export function startStop(){
    if(running) running = false;
    else {
        running = true;
        tick();
    }
    return running;
}

export function getTime(){
    return ({second, minute});
}

export function setTime(newMinute:number, newSecond:number){
    minute = newMinute;
    second = newSecond;
}

export function isRunning(){
    return running;
}