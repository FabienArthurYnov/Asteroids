import {mousePos, globalVariables} from "../main.js";
import {lerpAngle} from "../utility/utiliyMath.js";
import {lostCondition} from "./life.js";

var fighterData = {
    x: 1500,
    y: 1500,
    vector: {
        x: 0,
        y: 0,
    },
    rotation: 0,
    rotationSpeed: 0.05,  // around 0.1 ; 0.01
    weight: 1,
    mainThrusterForce : 1/6,
    sideThrusterForce : 1/6/3,
    reverseThrusterForce : 1/6/2,
    brakeForce : 1/6/10,
    size: 50,
}
var keyBeingPressed = {
    z: false,
    s: false,
    q: false,
    d: false,
    space: false,
    f: false,
}

body.addEventListener('keydown', function onEvent(event) {
    if (event.key === "d") {
        keyBeingPressed.d = true;
    }
    if (event.key === "q") {
        keyBeingPressed.q = true;
    }
    if (event.key === "z") {
        keyBeingPressed.z = true;
    }
    if (event.key === "s") {
        keyBeingPressed.s = true;
    }
    if (event.keyCode == 32) {  // espace
        keyBeingPressed.space = true;
    }
    if (event.key === "f") {
        keyBeingPressed.f = true;
    }
})
body.addEventListener('keyup', function onEvent(event) {
    if (event.key === "d") {
        keyBeingPressed.d = false;
    }
    if (event.key === "q") {
        keyBeingPressed.q = false;
    }
    if (event.key === "z") {
        keyBeingPressed.z = false;
    }
    if (event.key === "s") {
        keyBeingPressed.s = false;
    }
    if (event.keyCode == 32) {
        keyBeingPressed.space = false;
    }
    if (event.key === "f") {
        keyBeingPressed.f = false
    }
})

// récupère les inputs
function controller() {
    if (keyBeingPressed.d) {
        fighterData.vector.x += -mousePos.pointingY * fighterData.sideThrusterForce / fighterData.weight
        fighterData.vector.y += mousePos.pointingX * fighterData.sideThrusterForce / fighterData.weight
        
        leftThruster.style.visibility = "visible";
    } else {
        leftThruster.style.visibility = "hidden"
    }
    if (keyBeingPressed.q) {
        
        fighterData.vector.x += mousePos.pointingY * fighterData.sideThrusterForce / fighterData.weight
        fighterData.vector.y += -mousePos.pointingX * fighterData.sideThrusterForce / fighterData.weight
        
        rightThruster.style.visibility = "visible";
    } else {
        rightThruster.style.visibility = "hidden"
    }
    if (keyBeingPressed.z) {
        fighterData.vector.x += mousePos.pointingX * fighterData.mainThrusterForce / fighterData.weight
        fighterData.vector.y += mousePos.pointingY * fighterData.mainThrusterForce / fighterData.weight
        
        mainThruster.style.visibility = "visible";
    } else {
        mainThruster.style.visibility = "hidden"
    }
    if (keyBeingPressed.s) {
        fighterData.vector.x -= mousePos.pointingX * fighterData.reverseThrusterForce / fighterData.weight
        fighterData.vector.y -= mousePos.pointingY * fighterData.reverseThrusterForce / fighterData.weight

        reverseThruster.style.visibility = "visible";
    } else {
        reverseThruster.style.visibility = "hidden"
    }
    if (keyBeingPressed.space) {
        fighterData.vector.y += -(fighterData.vector.y* fighterData.brakeForce / fighterData.weight);
        fighterData.vector.x += -(fighterData.vector.x* fighterData.brakeForce / fighterData.weight);
        if ((fighterData.vector.y < 1/2 && fighterData.vector.y > -1/2) && (fighterData.vector.x < 1/2 && fighterData.vector.x > -1/2)) {
            fighterData.vector.y = 0;
            fighterData.vector.x = 0;
        }
    }

    angle()
    movePlayer()
}


// bouge le joueur selon le vecteur et les collisions
function movePlayer() {
    fighterData.y += fighterData.vector.y
    fighterData.x += fighterData.vector.x

    if (fighterData.y < 50) {  // taille du vaisseau / 2 + 15 to not have a scrollbar appearing or the wings out of screen
        fighterData.y = 50
        collideBounce(false)
    }
    if (fighterData.y > globalVariables.heightGame - 50) {  
        fighterData.y = globalVariables.heightGame - 50
        collideBounce(false)
    }
    if (fighterData.x < 50) {  // taille du vaisseau / 2
        fighterData.x = 50
        collideBounce(true)
    }
    if (fighterData.x > globalVariables.widthGame - 50) {  
        fighterData.x = globalVariables.widthGame - 50
        collideBounce(true)
    }

    fighter.style.top = fighterData.y + "px";
    fighter.style.left = fighterData.x + "px";
}

// rebondis avec les collisions, isOnX = true if collision is on X axis, or false if not
function collideBounce(isOnX) {
    var newVectorX = 0
    var newVectorY = 0

    var dmg = Math.round(Math.abs(fighterData.vector.x + fighterData.vector.y))

    lostCondition(dmg)

    if (isOnX) {
        newVectorX = -(fighterData.vector.x/4)
        newVectorY = (fighterData.vector.y/4)
    } else {
        newVectorX = (fighterData.vector.x/4)
        newVectorY = -(fighterData.vector.y/4)
    }

    fighterData.vector.x = newVectorX
    fighterData.vector.y = newVectorY
}

// move the fighter to point the mouse, and update the rotation data
function angle() {
    mousePos.targetAngle = Math.atan2(mousePos.y - fighterData.y, mousePos.x - fighterData.x)+1/2*Math.PI;  // LES MAAAATHS  LES RADIAAAANNNS

    fighterData.rotation = lerpAngle(fighterData.rotation, mousePos.targetAngle, fighterData.rotationSpeed);

    mousePos.angleWithFighter = fighterData.rotation
    mousePos.pointingY = -Math.cos(fighterData.rotation);
    mousePos.pointingX = Math.sin(fighterData.rotation);

    fighter.style.transform = 'translate(-50%, -50%) rotate(' + fighterData.rotation + 'rad)';
}

export {controller, fighterData};



