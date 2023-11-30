import { fighterData } from "../player/controller.js";
import { getRandomBetween } from "../utility/utiliyMath.js";
import { globalVariables} from "../main.js";
import { lostCondition } from "../player/life.js";

var asteroids = {
    asteroidList: [],
    explosionList: [],
    damagelist : [],
}


function generateAsteroid(x) {
    var asteroid = {
        y: Math.floor(getRandomBetween(500, globalVariables.heightGame - 500)),
        x: Math.floor(getRandomBetween(500, globalVariables.widthGame - 500)),
        size: Math.floor(getRandomBetween(50, 500)),
        asteroidHtml: new Image(),
        distanceWithFighter: 100,
        gotHit: 11,  //it can collide only once per 10 frames
        vector: {
            x: Math.floor(getRandomBetween(-5, 5)),
            y: Math.floor(getRandomBetween(-5, 5)),
        },
        weight: 0,
        id: x,
    }
    asteroid.weight = asteroid.size / 100;
    asteroid.id = x;

    asteroid.asteroidHtml.style.width = asteroid.size + "px";
    asteroid.asteroidHtml.style.height = asteroid.size + "px";
    asteroid.asteroidHtml.style.transform = "translate(-50%, -50%)"
    asteroid.asteroidHtml.style.position = "absolute"

    asteroid.y = Math.floor(getRandomBetween(50, globalVariables.widthGame - 50))
    asteroid.asteroidHtml.style.top = asteroid.y + 'px'

    asteroid.x = Math.floor(getRandomBetween(50, globalVariables.widthGame - 50))
    asteroid.asteroidHtml.style.left = asteroid.x + 'px'

    asteroid.distanceWithFighter = Math.abs(fighterData.y - asteroid.y) + Math.abs(fighterData.x - asteroid.x)

    asteroid.asteroidHtml.src = "../../assets/images/Asteroid1.png"
    asteroid.asteroidHtml.id = "asteroidHtml" + asteroid.id.toString()
    asteroid.gotHit = 11

    asteroid.isThereCoin = true

    var overlaping = false
    for (var asteroidSecond of asteroids.asteroidList) {
        if ((Math.abs(asteroid.x - asteroidSecond.x) + Math.abs(asteroid.y - asteroidSecond.y) < asteroid.size / 2 + asteroidSecond.size / 2)) {
            overlaping = true
        }
    }
    if (!overlaping && !(isItInView(asteroid.x, asteroid.y))) {
        asteroids.asteroidList.push(asteroid)
        asteroidsLayer.appendChild(asteroid.asteroidHtml)
    } else {
        generateAsteroid(x)
    }
}

// check si l'objet aux coordonées x et y est en vu du joueur
function isItInView(x, y) {
    const viewportLeft = fighterData.x - window.innerWidth / 2;
    const viewportRight = fighterData.x + window.innerWidth / 2;
    const viewportTop = fighterData.y - window.innerHeight / 2;
    const viewportBottom = fighterData.y + window.innerHeight / 2;

    return x >= viewportLeft && x <= viewportRight && y >= viewportTop && y <= viewportBottom;
}


function updateAsteroids() {

    // gère les explosions

    for (var explosion of asteroids.explosionList) {
        explosion.lifetime -= 1
        if (explosion.lifetime <= 0) {
            document.getElementById("explosion" + explosion.id).remove()
            asteroids.explosionList.splice(asteroids.explosionList.indexOf(explosion), 1)
        }
    }
    asteroids.asteroidList.forEach(updateOneAsteroid)


}
function updateOneAsteroid(item) {
    item.x += item.vector.x
    item.y += item.vector.y
    item.asteroidHtml.style.top = item.y + 'px'
    item.asteroidHtml.style.left = item.x + 'px'
    item.gotHit += 1
    checkCollision(item)
}

function checkCollision(asteroidFirst) {
    // with the side of map
    if (asteroidFirst.x < asteroidFirst.size / 2) {
        asteroidFirst.vector.x *= -1
        asteroidFirst.x = asteroidFirst.size / 2 + 1 // so they aren't stuck on a border
    }
    if (asteroidFirst.x > globalVariables.widthGame - asteroidFirst.size / 2) {
        asteroidFirst.vector.x *= -1
        asteroidFirst.x = globalVariables.widthGame - asteroidFirst.size / 2 - 1
    }
    if (asteroidFirst.y < asteroidFirst.size / 2) {
        asteroidFirst.vector.y *= -1
        asteroidFirst.y = asteroidFirst.size / 2 + 1
    }
    if (asteroidFirst.y > globalVariables.heightGame - asteroidFirst.size / 2) {
        asteroidFirst.vector.y *= -1
        asteroidFirst.y = globalVariables.heightGame - asteroidFirst.size / 2 - 1
    }

    // collision with fighter
    if (Math.abs(asteroidFirst.x - fighterData.x) + Math.abs(asteroidFirst.y - fighterData.y) < asteroidFirst.size / 2 + fighterData.size / 2) {
        asteroidCollision(asteroidFirst, fighterData) // Using fighter as an asteroid. having norms in the naming of variable allow that. Asteroid and fighterData are two class really similar
        
        
        var diffSpeed = Math.abs(asteroidFirst.vector.x - fighterData.vector.x) + Math.abs(asteroidFirst.vector.y - fighterData.vector.y)
        var dmg = Math.round(diffSpeed*asteroidFirst.weight)

        lostCondition(dmg)

        
    }

    // between asteroids
    if (asteroidFirst.gotHit > 10) {
        for (var asteroidSecond of asteroids.asteroidList) { // rip FPS  
            if ((Math.abs(asteroidFirst.x - asteroidSecond.x) + Math.abs(asteroidFirst.y - asteroidSecond.y) < asteroidFirst.size / 2 + asteroidSecond.size / 2) && (asteroidFirst !== asteroidSecond)) {
                asteroidCollision(asteroidFirst, asteroidSecond)
            }
        }
    }
}

/* gère une collision entre deux astéroïdes
I tried to do more complicated thing, available in commit history, maybe I will come back one day  -Fabien
*/
function asteroidCollision(asteroidFirst, asteroidSecond) {
    var temp = {
        x1: asteroidFirst.vector.x,
        y1: asteroidFirst.vector.y,
        x2: asteroidSecond.vector.x,
        y2: asteroidSecond.vector.y,
    }
    var weightRatio1 = (asteroidFirst.weight / asteroidSecond.weight) / 5 * 2 // passe de 0 à 5 à 0 to 2, pour pas augmenter de vitesse
    var weightRatio2 = 2 - weightRatio1


    if (asteroidFirst.weight < asteroidSecond.weight) {
        asteroidFirst.vector.x = Math.round((-(temp.x1) * weightRatio1 + temp.x2 * weightRatio2) / 2)
        asteroidFirst.vector.y = Math.round((-(temp.y1) * weightRatio1 + temp.y2 * weightRatio2) / 2)
        asteroidSecond.vector.x = Math.round((temp.x1 * weightRatio1 + temp.x2 * weightRatio2) / 2)
        asteroidSecond.vector.y = Math.round((temp.x1 * weightRatio1 + temp.x2 * weightRatio2) / 2)
    } else {
        asteroidFirst.vector.x = Math.round((temp.x1 * weightRatio1 + temp.x2 * weightRatio2) / 2)
        asteroidFirst.vector.y = Math.round((temp.y1 * weightRatio1 + temp.y2 * weightRatio2) / 2)
        asteroidSecond.vector.x = Math.round((temp.x1 * weightRatio1 + -(temp.x2) * weightRatio2) / 2)
        asteroidSecond.vector.y = Math.round((temp.x1 * weightRatio1 + -(temp.x2) * weightRatio2) / 2)
    }

    asteroidFirst.x += asteroidFirst.vector.x
    asteroidFirst.y += asteroidFirst.vector.y
    asteroidSecond.x += asteroidSecond.vector.x
    asteroidSecond.y += asteroidSecond.vector.y

    // si la collision a pas marcher et les astéroïdes overlap, on les recule
    if ((Math.abs(asteroidFirst.x - asteroidSecond.x) + Math.abs(asteroidFirst.y - asteroidSecond.y) < asteroidFirst.size / 2 + asteroidSecond.size / 2)) {
        asteroidFirst.x += -temp.x1
        asteroidFirst.y += -temp.y1
        asteroidSecond.x += -temp.x2
        asteroidSecond.y += -temp.y2
    }

    // si c tjr overlap, delete it
    if ((Math.abs(asteroidFirst.x - asteroidSecond.x) + Math.abs(asteroidFirst.y - asteroidSecond.y) < asteroidFirst.size / 2 + asteroidSecond.size / 2)) {
        explode(asteroidFirst)
    }

    // if 0, it will stop everything it hit, we don't want that
    if (asteroidFirst.vector.x === 0) {
        if (getRandomBetween(0, 2) === 0) { asteroidFirst.vector.x = 1 } else { asteroidFirst.vector.x = -1 }
    }
    if (asteroidFirst.vector.y === 0) {
        if (getRandomBetween(0, 2) === 0) { asteroidFirst.vector.x = 1 } else { asteroidFirst.vector.x = -1 }
    }
    if (asteroidSecond.vector.x === 0) {
        if (getRandomBetween(0, 2) === 0) { asteroidSecond.vector.x = 1 } else { asteroidSecond.vector.x = -1 }
    }
    if (asteroidSecond.vector.y === 0) {
        if (getRandomBetween(0, 2) === 0) { asteroidSecond.vector.y = 1 } else { asteroidSecond.vector.y = -1 }
    }


    asteroidSecond.gotHit = 0
    asteroidFirst.gotHit = 0

}
function explode(asteroid) {
    var explosion = {
        id: asteroid.id,
        lifetime: 30,
        size: asteroid.size,
        explosionHtml: new Image(),
    }
    explosion.explosionHtml.src = "https://imgs.search.brave.com/kOXaxJft5ARoDAPeUP9OCUG35D7urooN9DfFxHP93No/rs:fit:200:200:1/g:ce/aHR0cHM6Ly9pLmdp/ZmVyLmNvbS9vcmln/aW4vNjIvNjIzY2Rj/Y2E4ODJkYjJkN2Vm/YThkMzI0MjRhNjFk/MjlfdzIwMC5naWY.gif"
    explosion.explosionHtml.id = 'explosion' + explosion.id
    explosion.explosionHtml.style.width = explosion.size + 'px'
    explosion.explosionHtml.style.height = explosion.size + 'px'
    explosion.explosionHtml.style.top = asteroid.y + 'px'
    explosion.explosionHtml.style.left = asteroid.x + 'px'
    explosion.explosionHtml.style.transform = "translate(-50%, -50%)"
    explosion.explosionHtml.style.position = "relative"
    asteroidsLayer.appendChild(explosion.explosionHtml)
    asteroids.explosionList.push(explosion)

    document.getElementById('asteroidHtml' + asteroid.id.toString()).remove()
    generateAsteroid(asteroid.id)
    asteroids.asteroidList.splice(asteroids.asteroidList.indexOf(asteroid), 1)
}

function explodeFighter() {
    
    var explosion = {
        id: "fighter",
        lifetime : 30,
        x : fighterData.x,
        y : fighterData.y,
        width: fighter.width,
        height : fighter.height,
        explosionHtml: new Image(),
    }

    explosion.explosionHtml.src = "https://imgs.search.brave.com/kOXaxJft5ARoDAPeUP9OCUG35D7urooN9DfFxHP93No/rs:fit:200:200:1/g:ce/aHR0cHM6Ly9pLmdp/ZmVyLmNvbS9vcmln/aW4vNjIvNjIzY2Rj/Y2E4ODJkYjJkN2Vm/YThkMzI0MjRhNjFk/MjlfdzIwMC5naWY.gif"
    explosion.explosionHtml.id = "explosion" + explosion.id 
    explosion.explosionHtml.style.width = explosion.size + 'px'
    explosion.explosionHtml.style.height = explosion.size + 'px'
    explosion.explosionHtml.style.top = explosion.y + 'px'
    explosion.explosionHtml.style.left = explosion.x + 'px'
    explosion.explosionHtml.style.transform = "translate(-50%, -50%)"
    explosion.explosionHtml.style.position = "relative" 


    globalVariables.explosionFighter.appendChild(explosion.explosionHtml)
    asteroids.explosionList.push(explosion)

}

// function damage() {

//     var damage : {
        
//     }
// }

export { generateAsteroid, asteroids, updateAsteroids, explodeFighter, isItInView }

