import {fighterData} from "../player/controller.js"

let counter = 0;
let seconds = 0;
let startOfFrame = new Date().getTime();
let oneFrameTime;

function updateDebug() {
    fpsCounter.innerHTML = countFPS() + 'fps'
    posCounter.innerHTML = 'x, y : ' + Math.round(fighterData.x) + ', ' + Math.round(fighterData.y)
    speedCounter.innerHTML = 'speed: ' + Math.round((Math.abs(fighterData.vector.x)+Math.abs(fighterData.vector.y))*60) + ' = ' + Math.round(fighterData.vector.x*60) + ' + ' + Math.round(fighterData.vector.y*60);
    rotationCounter.innerHTML = 'rotation: ' + Math.round(fighterData.rotation * 10)/10 + 'rad'
}

function countFPS() {
    let timeNow = new Date().getTime()
    let oneFrameTime = (timeNow - startOfFrame) / 1000
    
    startOfFrame = new Date().getTime();

    var fps = Math.round(1/oneFrameTime)

    fpsCounter.style.color = "rgb(70, 211, 70)"
    if (fps < 30) {
        fpsCounter.style.color = "rgb(232, 94, 30)"
    }
    if (fps < 10) {
        fpsCounter.style.color = "rgb(243, 9, 9)"
    }
    return fps
}

export {countFPS, updateDebug}