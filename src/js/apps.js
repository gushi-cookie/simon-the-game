import SimonTheGame from "./components/SimonTheGame.js";

window.simonTheGameApp = new Vue({
  el: "#game",
  components: {
    "simon-the-game": SimonTheGame
  },
  data: {
    sounds: {
      blue: [ {format: "audio/mp3", path: "sounds/1.mp3"}, {format: "audio/ogg", path: "sounds/1.ogg"} ],
      red: [ {format: "audio/mp3", path: "sounds/2.mp3"}, {format: "audio/ogg", path: "sounds/2.ogg"} ],
      yellow: [ {format: "audio/mp3", path: "sounds/3.mp3"}, {format: "audio/ogg", path: "sounds/3.ogg"} ],
      green: [ {format: "audio/mp3", path: "sounds/4.mp3"}, {format: "audio/ogg", path: "sounds/4.ogg"} ]
    }
  }
});