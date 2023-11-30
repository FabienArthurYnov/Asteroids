import { globalVariables, lostVariables } from "../main.js";
import { write } from "../utility/function.js";
import { explodeFighter } from "../entities/asteroid.js";


var hurtScreen = {
    color: "rgba(165, 11, 11, 0);",
    alpha: 0,
}

function lostCondition(dmg) {

    globalVariables.hp = globalVariables.hp - dmg * 2
    updateLifeBar()
    hurtScreen.alpha = 0.40;

    if (globalVariables.hp <= 0) {
        globalVariables.life = globalVariables.life - 1
        explodeFighter()

        globalVariables.lostLifeOn = true

        if (globalVariables.life <= 0) {
            globalVariables.life = 0

            lostVariables.score = globalVariables.score
            lostVariables.time = globalVariables.time
            document.getElementById("fighter").remove()
            write(lostVariables, "data")


            location.href = "http://127.0.0.1:5501/lost.html"
        }
        globalVariables.hp = 100
    }
    

}

function updateLifeBar() {
    var lifePercent = globalVariables.hp/globalVariables.hp_max
    lifeBarLive.style.width = Math.round(400 * lifePercent)+"px"

}

function updateHurtScreen() {
    if (hurtScreen.alpha > 0) {
        hurtScreen.alpha -= 0.01;
        var alphaString = Math.round(hurtScreen.alpha*100)/100;
        var rgbaString = "rgba(165, 11, 11, "+alphaString.toString()+")";
        document.getElementById("hurtScreen").style.backgroundColor = rgbaString;
    }
}

export { lostCondition, updateLifeBar, updateHurtScreen }