import { read } from "../utility/function.js"

var score = document.getElementById("score")
var time = document.getElementById("time")

var infoPlayer = read("data")

score.innerHTML = "Score : " + infoPlayer.score

if(infoPlayer.time < 60) {
    time.innerHTML = "Temps : " + infoPlayer.time + "s"
} else if (infoPlayer.time >= 60 && infoPlayer.time < 3600) {
    
    time.innerHTML = "Temps : " + Math.trunc(infoPlayer.time / 60) + "min " + infoPlayer.time%60 + "s"
}