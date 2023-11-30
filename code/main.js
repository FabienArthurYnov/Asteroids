import { controller, fighterData } from "./player/controller.js";
import { updateDebug } from "./affichage/debug.js"
import { updateGreenCoin } from "./entities/coin.js";
import users from "../data/ship.json" assert {type: "json"}
import { generateAsteroid, updateAsteroids } from "./entities/asteroid.js";
import { updateHeal } from "./Entities/boost.js"
import { updateHurtScreen } from "./player/life.js"

var globalVariables = {
    widthGame: 3000,  // also change css of background mapImage
    heightGame: 3000, // same ^
    time: 0,
    explosionFighter : document.getElementById("explosionFighter"),
    lostLifeOn: false,
    score: 0,
    life: 1,
    hp: 100,
    hp_max: 100,
}

var lostVariables = {
    score: 0,
    time: 0,
}

var mousePos = {
    truePosRelativeViewport: {
        x: 0,
        y: 0,
    },
    x: 0,
    y: 0,
    angleWithFighter: 0,
    targetAngle: 0,
    pointingX: 0,
    pointingY: 0,
}

var menuOn = {
    debug: false,
    pause: false,
    choice: false,
}

menuOn.pause = true
var intervalID
var nb = 0



for (var i = 0; i < 15; i += 1) {
    generateAsteroid(i)
}

requestAnimationFrame(mainLoop)


function mainLoop() {
    controller()

    window.scroll(-((window.innerWidth / 2) - fighterData.x), -((window.innerHeight / 2) - fighterData.y))

    updateAsteroids()
    updateGreenCoin()
    updateHeal()
    updateMousePos()
    updateHurtScreen()
    if (menuOn.debug) {
        updateDebug()
    }


    if (!menuOn.pause) {
        requestAnimationFrame(mainLoop)
    }

}


// update la position de la souris
body.addEventListener("mousemove", function rotateWithCursor(event) {
    mousePos.truePosRelativeViewport.x = event.clientX
    mousePos.truePosRelativeViewport.y = event.clientY
})
// update de la position relative de la souris par rapport a l'image de fond
function updateMousePos() {
    const rect = backgroundMapImage.getBoundingClientRect();
    mousePos.x = mousePos.truePosRelativeViewport.x - rect.left;
    mousePos.y = mousePos.truePosRelativeViewport.y - rect.top;
}

// réagit aux touches a presser une fois (menus)
body.addEventListener('keydown', function onEvent(event) {
    if (event.keyCode == 45) {  // insert debug mode
        if (menuOn.debug) {
            menuOn.debug = false
            debug.style.display = "none";
        } else {
            menuOn.debug = true
            debug.style.display = "flex";
        }
    }

    if (menuOn.choice == true) {
        if (event.keyCode == 27) {
            gamePaused.style.display = "flex";
            menuOn.pause = true
            globalVariables.timeOn = false
            clearInterval(intervalID)
        }
    }
})

unpaused.addEventListener('click', function UnPaused() {
    menuOn.pause = false
    globalVariables.timeOn = true
    gamePaused.style.display = "none";

    intervalID = setInterval(function () {
        globalVariables.time++
    }, 1000);

    requestAnimationFrame(mainLoop)
})

quit.addEventListener('click', function UnPaused() {
    gamePaused.style.display = "none";
})

first.addEventListener('click', function () {
    fighterData.rotationSpeed = users[0].rotationSpeed
    fighterData.mainThrusterForce = users[0].mainThrusterForce
    fighterData.sideThrusterForce = users[0].sideThrusterForce
    fighterData.reverseThrusterForce = users[0].reverseThrusterForce
    fighterData.brakeForce = users[0].brakeForce
    game.style.display = "flex"
    choice.style.display = "none"
    menuOn.pause = false
    menuOn.choice = true
    globalVariables.timeOn = true

    intervalID = setInterval(function () {
        globalVariables.time++
    }, 1000);

    requestAnimationFrame(mainLoop)
})

second.addEventListener('click', function () {
    fighterData.rotationSpeed = users[1].rotationSpeed
    fighterData.mainThrusterForce = users[1].mainThrusterForce
    fighterData.sideThrusterForce = users[1].sideThrusterForce
    fighterData.reverseThrusterForce = users[1].reverseThrusterForce
    fighterData.brakeForce = users[1].brakeForce
    game.style.display = "flex"
    choice.style.display = "none"
    menuOn.pause = false
    menuOn.choice = true
    globalVariables.timeOn = true

    intervalID = setInterval(function () {
        globalVariables.time++
    }, 1000);

    requestAnimationFrame(mainLoop)
})




export { mousePos, menuOn, globalVariables, lostVariables }




/*
// LAG MACHINE AHAH   ~17fps at cpt = 400, ~7fps at cpt = 500
let cpt = 0
let cpt2= 400
for (let i = 0; i < cpt2; i++) {
    for (let i = 0; i < cpt2; i++) {
        for (let i = 0; i < cpt2; i++) {
            cpt+=10
        }
    }
}*/