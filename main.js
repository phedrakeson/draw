/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/main.js":
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_sketch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/sketch.js */ \"./scripts/modules/sketch.js\");\n\r\n\r\nconst sketch = new _modules_sketch_js__WEBPACK_IMPORTED_MODULE_0__.default('sketch');\r\n\r\nsketch.setup();\r\n\n\n//# sourceURL=webpack://draw/./scripts/main.js?");

/***/ }),

/***/ "./scripts/modules/sketch.js":
/*!***********************************!*\
  !*** ./scripts/modules/sketch.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ Sketch\n/* harmony export */ });\nclass Sketch {\r\n  constructor(canvas) {\r\n    this.canvas = document.getElementById(canvas)\r\n    this.context = this.canvas.getContext('2d')\r\n    this.pressed = false;\r\n    \r\n    this.x = undefined;\r\n    this.y = undefined;\r\n    this.ongoingTouches = new Array;\r\n\r\n    this.handleStart = this.handleStart.bind(this);\r\n    this.handleEnd = this.handleEnd.bind(this);\r\n    this.handleMove = this.handleMove.bind(this);\r\n    this.handleCancel = this.handleCancel.bind(this);\r\n    this.ongoingTouchIndexById = this.ongoingTouchIndexById.bind(this);\r\n    this.copyTouch = this.copyTouch.bind(this);\r\n    this.adjustLine = this.adjustLine.bind(this);\r\n\r\n\r\n    this.canvas.width = window.innerWidth;\r\n    this.canvas.height = window.innerHeight;\r\n  }\r\n\r\n  mouseRecognitions() {\r\n    this.canvas.addEventListener('mousedown', (event) => {\r\n      this.pressed = true;\r\n\r\n      this.x = event.offsetX;\r\n      this.y = event.offsetY;\r\n    })\r\n\r\n    this.canvas.addEventListener('mouseup', () => {\r\n      this.pressed = false;\r\n\r\n      this.x = undefined;\r\n      this.y = undefined;\r\n    })\r\n\r\n    this.canvas.addEventListener('mousemove', (event) => {\r\n      if(this.pressed) {\r\n\r\n        const x2 = event.offsetX;\r\n        const y2 = event.offsetY;\r\n        this.drawCircle(x2, y2)\r\n        this.drawLine(this.x, this.y, x2, y2);\r\n        this.x = x2;\r\n        this.y = y2;\r\n      }\r\n    })\r\n  }\r\n\r\n  touchRecognitions() {\r\n    this.canvas.addEventListener('touchstart', this.handleStart, false);\r\n    this.canvas.addEventListener('touchend', this.handleEnd, false);\r\n    this.canvas.addEventListener('touchmove', this.handleMove, false);\r\n    this.canvas.addEventListener('touchcancel', this.handleCancel, false);\r\n    this.canvas.addEventListener('touchleave', this.handleEnd, false)\r\n  }\r\n\r\n  // Mobile drawing handlers\r\n\r\n  handleStart(event) {\r\n    const touches = event.changedTouches;\r\n    event.preventDefault();\r\n\r\n    for(let i = 0; i < touches.length; i++) {\r\n      this.ongoingTouches.push(this.copyTouch(touches[i]));\r\n    }\r\n  }\r\n\r\n  handleMove(event) {\r\n    event.preventDefault();\r\n\r\n    const touches = event.changedTouches;\r\n\r\n    for(let i = 0; i < touches.length; i++) {\r\n      const idx = this.ongoingTouchIndexById(touches[i].identifier);\r\n      this.x = this.ongoingTouches[idx].clientX;\r\n      this.y = this.ongoingTouches[idx].clientY;\r\n\r\n      const x2 = touches[i].clientX;\r\n      const y2 = touches[i].clientY;\r\n      if(idx >= 0) {\r\n        this.drawLine(x2,y2)\r\n        this.drawLine(this.x, this.y, x2, y2)\r\n        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));\r\n      } else {\r\n        console.error(\"Can't figure out which touch to continue.\")\r\n      }\r\n    }\r\n  }\r\n\r\n  handleEnd(event) {\r\n    event.preventDefault();\r\n    const touches = event.changedTouches;\r\n\r\n    for(let i = 0; i < touches.length; i++) {\r\n      const idx = this.ongoingTouchIndexById(touches[i].identifier);\r\n      if(idx >= 0) {\r\n        this.context.beginPath();\r\n        this.ongoingTouches.splice(idx, 1);\r\n      } else {\r\n        console.error(\"Can't figure out which touch to end.\")\r\n      }\r\n    }\r\n  }\r\n\r\n  handleCancel(event) {\r\n    event.preventDefault();\r\n\r\n    const touches = event.changedTouches;\r\n\r\n    for(let i = 0; i < touches.length; i++) \r\n      this.ongoingTouches.splice(i, 1);\r\n  }\r\n\r\n  copyTouch(touch) {\r\n    return { identifier: touch.identifier, clientX: touch.clientX, clientY: touch.clientY };\r\n  }\r\n\r\n  ongoingTouchIndexById(idToFind) {\r\n    for (var i=0; i < this.ongoingTouches.length; i++) {\r\n      var id = this.ongoingTouches[i].identifier;\r\n  \r\n      if (id == idToFind) {\r\n        return i;\r\n      }\r\n    }\r\n    return -1;\r\n  }\r\n\r\n\r\n  // -----------------\r\n\r\n  setup() {\r\n    this.configSetup();\r\n    this.mouseRecognitions();\r\n    this.touchRecognitions();\r\n  }\r\n\r\n  // configurations\r\n\r\n  configSetup() {\r\n    this.adjustLine();\r\n    this.adjustColor();\r\n    this.clearBoard();\r\n  }\r\n\r\n  adjustLine() {\r\n    this.decreaseBtn = document.getElementById('decrease');\r\n    this.increaseBtn = document.getElementById('increase');\r\n    this.lineWidthElement = document.getElementById('widthValue');\r\n    this.value = 2\r\n    this.lineWidthElement.innerText = this.value\r\n    this.decreaseBtn.addEventListener('click', () => {\r\n      this.value -= 2;\r\n      if(this.value <= 0)\r\n        this.value = 2;\r\n\r\n        this.lineWidthElement.innerText = this.value;\r\n      this.updateWidthValueOnScreen(this.value);\r\n\r\n    });\r\n\r\n    this.increaseBtn.addEventListener('click', () => {\r\n      this.value += 2;\r\n      if(this.value >= 20)\r\n        this.value = 20;\r\n      this.lineWidthElement.innerText = this.value;\r\n      this.updateWidthValueOnScreen(this.value);\r\n\r\n    })\r\n\r\n  }\r\n\r\n  adjustColor() {\r\n    this.color = document.getElementById('color');\r\n    this.color.addEventListener('change', (event) => {\r\n      this.color = event.target.value;\r\n    })\r\n  }\r\n\r\n  updateWidthValueOnScreen(value) {\r\n    this.lineWidthElement.innerText = value;\r\n  }\r\n\r\n  // Drawing methods\r\n\r\n  drawLine(x1, y1, x2, y2) {\r\n    this.context.lineWidth = this.lineWidthElement.innerText * 2;\r\n    this.context.beginPath();\r\n    this.context.moveTo(x1, y1);\r\n    this.context.lineTo(x2,y2);\r\n    this.context.strokeStyle = this.color\r\n    this.context.stroke()\r\n  }\r\n\r\n  drawCircle(x, y) {\r\n    this.context.beginPath()\r\n    this.context.arc(x, y, this.lineWidthElement.innerText, 0, Math.PI * 2);\r\n    this.context.fillStyle = this.color;\r\n    this.context.fill()\r\n  }\r\n\r\n  clearBoard() {\r\n    const trashBtn = document.getElementById('trash');\r\n    trashBtn.addEventListener('click', () => {\r\n      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n    });\r\n  }\r\n  \r\n}\n\n//# sourceURL=webpack://draw/./scripts/modules/sketch.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./scripts/main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;