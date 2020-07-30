// sounds пропс должен быть объект, формата:
// {
//  blue: [ {format: "MIME", path: "path.ogg"}, {format: "audio/mp3", path: "path.mp3"} ]
//  red: [...]
//  yellow: [...]
//  green: [...]
// }
//

export default
{
  template:
  `
  <div class="simon-the-game">

    <div class="game">
      <div class="blue" @click="quarterClick($event, 1)"></div>
      <div class="red" @click="quarterClick($event, 2)"></div>
      <div class="yellow" @click="quarterClick($event, 3)"></div>
      <div class="green" @click="quarterClick($event, 4)"></div>
    </div>

    <div class="counter"> {{ path.length > 0 ? "Раунд: " + path.length : "нажмите начать" }} </div>

    <div class="btn-container">
      <div class="btn" @click="start">Начать</div>
    </div>
    
    <div class="difficulty">
      <h3>Сложность</h3>
      <label><input v-model="difficulty" name="difficulty" type="radio" value="0"> - лёгкий 1.5 сек</label>
      <label><input v-model="difficulty" name="difficulty" type="radio" value="1"> - средний 1 сек</label>
      <label><input v-model="difficulty" name="difficulty" type="radio" value="2"> - сложный 0.4 сек</label>
    </div>

  </div>
  `,
  watch: {
    difficulty: function(val, oldVal) {
      if(val == "0") {
        this.delay = 1.5;
      }else if(val == "1") {
        this.delay = 1;
      }else if(val == "2") {
        this.delay = 0.4;
      }
    }
  },
  data: function() {
    return {
      difficulty: "0",
      delay: 1.5,
      path: [],
      pathIndex: -1,

      pathPlayback: false,
      playbackInterval: null,

      blueSoundPath: null,
      redSoundPath: null,
      yellowSoundPath: null,
      greenSoundPath: null,

      blueElement: null,
      redElement: null,
      yellowElement: null,
      greenElement: null
    };
  },
  mounted: function() {
    let blueSounds = this.sounds.blue;
    let redSounds = this.sounds.red;
    let yellowSounds = this.sounds.yellow;
    let greenSounds = this.sounds.green;

    this.applySound("blueSoundPath", blueSounds);
    this.applySound("redSoundPath", redSounds);
    this.applySound("yellowSoundPath", yellowSounds);
    this.applySound("greenSoundPath", greenSounds);

    let game = this.$el;
    this.blueElement = game.getElementsByClassName("blue")[0];
    this.redElement = game.getElementsByClassName("red")[0];
    this.yellowElement = game.getElementsByClassName("yellow")[0];
    this.greenElement = game.getElementsByClassName("green")[0];
  },
  methods: {
    applySound(propertyName, soundsList) {
      //  1) Создаёт экземпляр Audio и указывает в его src путь
      //     к звуку, тип которого может быть воспроизведён. Это
      //     даст подгрузку звука в браузер.
      //  2) Путь к подходящему звуку попадает в указанное св-во
      //
      // soundsList - [ {format: "MIME", path: "path.ogg"}, {format: "audio/mp3", path: "path.mp3"} ]

      let audio = new Audio();
      audio.preload = "auto";

      let probablyFound = false;

      soundsList.forEach((ob) => {
        if(audio.canPlayType(ob.format) == "probably") {
          audio.src = ob.path;
          this[propertyName] = ob.path;
        }
      });

      if(!probablyFound) {
        soundsList.forEach((ob) => {
          if(audio.canPlayType(ob.format) == "maybe") {
            audio.src = ob.path;
            this[propertyName] = ob.path;
          }
        });
      }

    },

    start() {
      // 1) Сброс и начало игры
      
      if(this.playbackInterval != null) {
        clearInterval(this.playbackInterval);
        this.playbackInterval = null;
      }

      this.path = [];
      this.path.push(this.getRandomInt(1, 4));
      this.pathIndex = 0;
      this.playbackPath();

    },
    quarterClick(event, num) {

      if(this.pathPlayback || this.pathIndex == -1) {
        return;
      }

      this.playSound(num);

      if(this.path[this.pathIndex] == num) {
        // нажата правильная кнопка

        if(this.pathIndex == this.path.length-1) {
          // достигнут конец пути
          this.path.push(this.getRandomInt(1, 4));
          this.playbackPath();
          this.pathIndex = 0;
        }else {
          this.pathIndex++;
        }
        
        
      }else {
        this.pathIndex = -1;
        alert("проигрыш. нажмите старт");
      }

    },

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    blinkQuarter(element) {
      element.classList.add("active");
      setTimeout(() => {
        element.classList.remove("active");
      }, 300);
    },
    getSoundPathByNumber(num) {
      if(num == 1) {
        return this.blueSoundPath;
      }else if(num == 2) {
        return this.redSoundPath;
      }else if(num == 3) {
        return this.yellowSoundPath;
      }else if(num == 4) {
        return this.greenSoundPath;
      }
    },
    getQuarterElementByNumber(num) {
      if(num == 1) {
        return this.blueElement;
      }else if(num == 2) {
        return this.redElement;
      }else if(num == 3) {
        return this.yellowElement;
      }else if(num == 4) {
        return this.greenElement;
      }
    },
    playSound(num) {
      // 1) Создаёт экземпляр Audio и воспроиводит его
      // 2) Подсвечивает соответствующую четверть круга...
      
      let soundPath = this.getSoundPathByNumber(num);
      let audio = new Audio(soundPath);
      audio.play();
      this.blinkQuarter(this.getQuarterElementByNumber(num));
    },
    playbackPath() {
      this.pathPlayback = true;

      let index = 0;

      this.playbackInterval = setInterval( () => {
        let sound = null;

        this.playSound(this.path[index]);
        index++;

        if(index > this.path.length-1) {
          this.pathPlayback = false;
          clearInterval(this.playbackInterval);
          this.playbackInterval = null;
        }

      }, this.delay * 1000);
    }
  },
  props: ["sounds"]
}