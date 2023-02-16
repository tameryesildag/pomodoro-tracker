let minute:number = 25;

let second:number = 0;

let running:boolean = false;

export function tick(){
        if(!running) return;
        if(minute <= 0 && second <= 0){
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