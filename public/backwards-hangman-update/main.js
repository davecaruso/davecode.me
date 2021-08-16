/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: formatTime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatTime\", function() { return formatTime; });\n// List of playable words in order that they'll be played.\nconst PlayableWords = ['cow', 'ke$ha', 'curaçao', 'triscuit™', 'бык'];\n//const PlayableWords = ['cow'];\n\n// As you get closer to losing the delay between the letter disappearing and the\n// \"you're wrong\" text appearing gets shorter\nconst extraDelays = [225, 100, 50, 0, 0, 0, 0];\n\nconst letterCanvas = document.getElementById('letter-canvas');\nconst letterCtx = letterCanvas.getContext('2d');\nconst fxCanvas = fx.canvas();\n\nfxCanvas.id = 'fx-canvas';\ndocument.getElementById('guess').appendChild(fxCanvas);\n\nfunction formatTime(seconds) {\n  if (typeof seconds !== 'number') {\n    return 'N/A Seconds';\n  }\n  function plural(num, unit) {\n    num = Math.floor(num);\n    return num + ' ' + unit + (num === 1 ? '' : 's');\n  }\n  if (seconds < 120) {\n    return plural(seconds, 'Second');\n  }\n  if (seconds < 60 * 60) {\n    return plural(seconds / 60, 'Minute') + ' and '\n      + plural(seconds % 60, 'Second');\n  }\n  if (seconds < 24 * 60 * 60) {\n    return plural(seconds / (60 * 60), 'Hour') + ', '\n      + plural(seconds % (60 * 60) / 60, 'Minute') + ' and '\n      + plural(seconds % 60, 'Second');\n  }\n  return plural(seconds / (24 * 60 * 60), 'Day') + ', '\n    + plural(seconds % (24 * 60 * 60) / (60 * 60), 'Hour') + ', '\n    + plural(seconds % (60 * 60) / 60, 'Minute') + ' and '\n    + plural(seconds % 60, 'Second');\n}\n\nclass BackwardsHangman {\n  constructor() {\n    this.state = {\n      word: PlayableWords[0].split(''),\n      level: 0,\n      wrongCount: 0,\n      correctCount: 0,\n      wrongGuesses: [],\n      correctGuesses: [],\n      guessActive: false,\n      gameOver: false,\n      startTime: Date.now(),\n      usedCheat: false,\n    };\n  }\n\n  // Init\n  startGame() {\n    // set volume for all sounds\n    $('audio').each(function () {\n      $(this)[0].volume = .5;\n    });\n\n    $('#sfx-start')[0].play();\n    // Generate a random word and display its letters.\n    this.state.word = PlayableWords[0].split('');\n\n    this.displayNewWord(this.state.word);\n    this.startListener();\n    $('#game').css('display', 'flex');\n\n    window.win = () => {\n      this.win();\n      this.state.usedCheat = true;\n    }\n  }\n\n  restartGame(win = false) {\n    this.state = {\n      word: win ? PlayableWords[this.state.level + 1].split('') : PlayableWords[0].split(''),\n      level: win ? this.state.level + 1 : 0,\n      wrongCount: 0,\n      correctCount: 0,\n      wrongGuesses: [],\n      correctGuesses: [],\n      guessActive: false,\n      gameOver: false,\n      startTime: win ? this.state.startTime : Date.now(),\n      usedCheat: win ? this.state.usedCheat : false,\n      keyIsDown: false,\n    };\n\n    // Reshowing and rehiding various things.\n    $('rect#Rleg').show();\n    $('rect#Lleg').show();\n    $('rect#Rarm').show();\n    $('rect#Larm').show();\n    $('rect#torso').show();\n    $('path#head').show();\n    $('#used').text('');\n    $('#lose').hide();\n    $('#face').hide();\n    $('#used-letters').hide();\n    $('#time-taken').hide();\n    $('#word-letters').show();\n    $('#sun').hide();\n    $('body').attr('class', '');\n    $('#retry').css('display', 'none');\n    this.displayNewWord(this.state.word);\n    this.startListener();\n  }\n\n  displayNewWord(word) {\n    $('#word-letters').html(\n      word.map(letter => {\n        const $div = $('<div>', { class: `letter` });\n        $div.text(letter);\n        return $div;\n      }),\n    );\n  }\n\n  startListener() {\n    $(document).keyup(e => {\n      if (e.key === 'Compose') {\n        this.state.keyIsDown = 'Compose';\n      } else if (this.state.keyIsDown === true || this.state.keyIsDown === e.key) {\n        this.state.keyIsDown = false;\n      }\n    });\n    $(document).keypress(e => {\n      if (this.state.keyIsDown !== 'Compose') {\n        if (this.state.keyIsDown) return false;\n        this.state.keyIsDown = e.key;\n      } else {\n        this.state.keyIsDown = true;\n      }\n\n      if (this.state.guessActive) {\n        return false; // Just reject it\n      } else {\n        this.state.guessActive = true;\n\n        if (!this.state.gameOver) {\n          if (e.charCode > 32) {\n            this.guessLetter(e.key.toLowerCase());\n          }\n        }\n      }\n    });\n  }\n\n  guessLetter(letter) {\n    console.log('Guess', letter.toUpperCase());\n\n    $('#sfx-guess')[0].play();\n\n    // Display the guess\n    letterCanvas.width = innerWidth * 0.4;\n    letterCanvas.height = innerWidth * 0.4;\n    letterCtx.font = \"40vw Helvetica,Arial,sans-serif\";\n    letterCtx.textBaseline = \"middle\";\n    letterCtx.textAlign = \"center\";\n    letterCtx.fillStyle = \"#7389FF\";\n    letterCtx.strokeStyle = \"#fff\";\n    letterCtx.lineWidth = innerWidth * 0.008;\n    letterCtx.fillText(letter.toUpperCase(), letterCanvas.width / 2, letterCanvas.height / 2);\n    letterCtx.strokeText(letter.toUpperCase(), letterCanvas.width / 2, letterCanvas.height / 2);\n\n    // Draw the zoom blur\n    const texture = fxCanvas.texture(letterCanvas);\n    fxCanvas\n      .draw(texture)\n      .zoomBlur(letterCanvas.width / 2, letterCanvas.height / 2, 0.15)\n      .update();\n\n    texture.destroy();\n\n    $('#fx-canvas').removeClass('fade');\n    // Wait two frames\n    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {\n      $('#fx-canvas').addClass('fade');\n    }));\n\n    window.setTimeout(\n      () => {\n        letterCtx.clearRect(0, 0, letterCanvas.width, letterCanvas.height);\n      },\n      300,\n    );\n\n    // Wait a beat then evaluate the guess, not allowing a guess in that meantime.\n    window.setTimeout(() => {\n      if (this.state.word.includes(letter) && !this.state.correctGuesses.includes(letter)) {\n        this.correctGuess(letter);\n      } else {\n        this.incorrectGuess(letter);\n      }\n    }, 300 + extraDelays[this.state.wrongCount]);\n  }\n\n  correctGuess(letter) {\n    this.state.guessActive = false;\n\n    $('#sfx-correct')[0].play();\n\n    this.state.correctGuesses.push(letter);\n    ++this.state.correctCount;\n\n    // Whatever index the letter is in the word is also the index of the parent dom collection\n    const parentNodeList = $('#word-letters')\n      .children()\n      .toArray();\n\n    parentNodeList.forEach(letterNode => {\n      if (letterNode.innerText.toLowerCase() === letter) {\n        letterNode.innerText = '';\n      }\n    });\n\n    // If the correctCount is the same the sum of the unique characters in the word, win.\n    const sumOfUniq = new Set(this.state.word).size;\n    if (this.state.correctCount === sumOfUniq) this.win();\n  }\n\n  incorrectGuess(letter) {\n    // TODO: Move sound effects into helper fn.\n    $('#sfx-wrong')[0].play();\n\n    $('body').addClass('wrong');\n\n    this.state.wrongGuesses.push(letter);\n    ++this.state.wrongCount;\n\n    window.setTimeout(() => {\n      $('body').removeClass('wrong');\n\n      this.state.guessActive = false;\n\n      $('#used').text(this.state.wrongGuesses.join(''));\n      if ($('#used-letters').is(':hidden')) $('#used-letters').show();\n    }, 300);\n\n\n    switch (this.state.wrongCount) {\n      case 0:\n        console.error('incorrectGuess ran despite zero wrongCount?');\n        break;\n      case 1:\n        $('rect#Rleg').hide();\n        break;\n      case 2:\n        $('rect#Lleg').hide();\n        break;\n      case 3:\n        $('rect#Rarm').hide();\n        break;\n      case 4:\n        $('rect#Larm').hide();\n        break;\n      case 5:\n        $('rect#torso').hide();\n        break;\n      case 6:\n        $('path#head').hide();\n        window.setTimeout(() => this.lose(), 300);\n        break;\n    }\n  }\n\n  win() {\n    console.log('Win!');\n    this.state.gameOver = true;\n\n    window.setTimeout(() => {\n      if (this.state.level === PlayableWords.length - 1) {\n        // User has won the whole game\n        $('#word-letters').hide();\n        $('#used-letters').hide();\n        $('#time').text(\n          formatTime((Date.now() - this.state.startTime) / 1000) +\n          (this.state.usedCheat ? ' (cheated)' : '')\n        );\n        $('#face').show();\n        $('#sun').show();\n        $('body').addClass('win');\n        $('#sfx-win')[0].play();\n        window.setTimeout(() => {\n          $('#retry').css('display', 'block');\n          $('#time-taken').show();\n          $(document).keypress(e => {\n            $(document).unbind('keypress');\n            this.restartGame(false);\n          });\n        }, 1500);\n      } else {\n        // User has beaten level\n        console.log(\"Level up!\");\n        $('#sfx-level')[0].play();\n        $('body').addClass('level-up');\n        window.setTimeout(() => {\n          $('body').removeClass('level-up');\n          this.restartGame(true);\n        }, 830);\n      }\n    }, 200);\n  }\n\n  lose() {\n    this.state.gameOver = true;\n\n    $('#sfx-lose')[0].play();\n    $('#lose').show();\n\n    // Wait a bit and show a retry button\n    window.setTimeout(() => {\n      $('#retry').css('display', 'block');\n      $(document).keypress(e => {\n        $(document).unbind('keypress');\n        this.restartGame(false);\n      });\n    }, 500);\n  }\n}\n\nwindow.onload = () => {\n\n  if (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {\n    $('#touchscreen').show();\n  } else {\n    $(document).keypress(e => {\n      $(document).unbind('keypress');\n      $('#welcome').hide();\n      const Game = new BackwardsHangman();\n      Game.startGame();\n    });\n  }\n};\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });