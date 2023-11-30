import { globalVariables } from "../main.js";
import { fighterData } from "../player/controller.js";
import { getRandomBetween } from "../utility/utiliyMath.js";
import { write } from "../utility/function.js";

var greenCoin = {
   isThereCoin: false,
   x: 3000,
   y: 3000,
   distanceWithFighter: 100
}

var greenArrow = {
   greenArrowHtml: document.getElementById('greenArrow'),
   show: true,
   x: 700,  // relative to game
   y: 400,
   rotation: 0,
}

function updateGreenCoin() {
   updateGreenArrow()
   checkCollisionCoin()

   greenCoin.distanceWithFighter = Math.abs(fighterData.y - greenCoin.y) + Math.abs(fighterData.x - greenCoin.x)

   if (!greenCoin.isThereCoin) {
      generateCoin()
   }
}

function generateCoin() {
   var greenCoinImg = new Image();
   greenCoinImg.style.width = "50px";
   greenCoinImg.style.height = "50px";
   greenCoinImg.style.transform = "translate(-50%, -50%)"
   greenCoinImg.style.position = "absolute"

   greenCoin.y = Math.floor(getRandomBetween(50, globalVariables.heightGame - 50))
   greenCoinImg.style.top = greenCoin.y + 'px'

   greenCoin.x = Math.floor(getRandomBetween(50, globalVariables.widthGame - 50))
   greenCoinImg.style.left = greenCoin.x + 'px'

   greenCoin.distanceWithFighter = Math.abs(fighterData.y - greenCoin.y) + Math.abs(fighterData.x - greenCoin.x)

   greenCoinImg.src = "https://imgs.search.brave.com/DvSs9dMjWWgBeNakHRIdH2onuU9o5ILajd9Uyim0Jpg/rs:fit:923:868:1/g:ce/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/YmF0dGxlZm9yZHJl/YW1pc2xhbmRmYW5m/aWN0aW9uL2ltYWdl/cy8wLzBlL0dyZWVu/X0NvaW4ucG5nL3Jl/dmlzaW9uL2xhdGVz/dD9jYj0yMDE3MDgx/OTIwMTcxNQ"
   greenCoinImg.id = "greenCoinImg"

   greenCoin.isThereCoin = true
   greenCoinLayer.appendChild(greenCoinImg)
}

function updateGreenArrow() {
   // get the distance between fighter and coin to show or not the arrow
   if (greenCoin.distanceWithFighter < 150) {
      greenArrow.greenArrowHtml.style.display = "none"
   } else {
      greenArrow.greenArrowHtml.style.display = "block"
   }

   // get arrow position relative to viewport, between fighter and coin
   var angleCoinAndFighter = Math.atan2(greenCoin.y - fighterData.y, greenCoin.x - fighterData.x)
   greenArrow.x = fighterData.x + Math.cos(angleCoinAndFighter) * 100  // 100 pixel éloigné du fighter, dans la direction du greenCoin
   greenArrow.y = fighterData.y + Math.sin(angleCoinAndFighter) * 100


   // get rotation
   greenArrow.rotation = Math.atan2(greenArrow.y - greenCoin.y, greenArrow.x - greenCoin.x)

   // update the css
   greenArrow.greenArrowHtml.style.transform = 'translate(-50%, -50%) rotate(' + greenArrow.rotation + 'rad)'
   greenArrow.greenArrowHtml.style.left = greenArrow.x + 'px'
   greenArrow.greenArrowHtml.style.top = greenArrow.y + 'px'
}

function checkCollisionCoin() {
   if (greenCoin.distanceWithFighter < 45) {

      globalVariables.score += 1
      scoreCount.innerHTML = "Score : " + globalVariables.score

      document.getElementById('greenCoinImg').remove()
      generateCoin()
   }
}

export { updateGreenCoin }
