import { globalVariables } from "../main.js";
import { fighterData } from "../player/controller.js"
import { getRandomBetween } from "../utility/utiliyMath.js";
import { updateLifeBar } from "../player/life.js"

var heal = {
    isThereHeal: false,
    x: 3000,
    y: 3000,
    distanceWithFighter: 100
 }
 


function updateHeal() {
    checkCollisionHeal()
 
    heal.distanceWithFighter = Math.abs(fighterData.y - heal.y) + Math.abs(fighterData.x - heal.x)
 
    if (!heal.isThereHeal) {
       generateHeal()
    }
 }
 
 function generateHeal() {
    var healImg = new Image();
    healImg.style.width = "50px";
    healImg.style.height = "50px";
    healImg.style.transform = "translate(-50%, -50%)"
    healImg.style.position = "absolute"
    
    heal.y = Math.floor(getRandomBetween(50, globalVariables.heightGame - 50))
    healImg.style.top = heal.y + 'px'
    
    heal.x = Math.floor(getRandomBetween(50, globalVariables.widthGame - 50))
    healImg.style.left = heal.x + 'px'
 
    heal.distanceWithFighter = Math.abs(fighterData.y - heal.y) + Math.abs(fighterData.x - heal.x)
 
    healImg.src = "https://imgs.search.brave.com/vdAxjpRpoLYxXJBx9hqlhR40jTzyBlulPntI-k-ievU/rs:fit:1139:1107:1/g:ce/aHR0cDovL3d3dy5w/bmdtYXJ0LmNvbS9m/aWxlcy8yL1dyZW5j/aC1UcmFuc3BhcmVu/dC1QTkcucG5n"
    healImg.id = "healImg"
 
    heal.isThereHeal = true
    greenCoinLayer.appendChild(healImg)
 }
 

 function checkCollisionHeal() {
    if (heal.distanceWithFighter < 45) {
        globalVariables.hp += 25
        if (globalVariables.hp > globalVariables.hp_max) {
            globalVariables.hp = globalVariables.hp_max
        }
        updateLifeBar()
 
       document.getElementById('healImg').remove()
       generateHeal()
    }
 }
 
 export {updateHeal}
