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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ Sketch\n/* harmony export */ });\nclass Sketch {\r\n  constructor(canvas) {\r\n    this.canvas = document.getElementById(canvas)\r\n    this.context = this.canvas.getContext('2d')\r\n    this.pressed = false;\r\n    \r\n    this.x = undefined;\r\n    this.y = undefined;\r\n\r\n    this.ongoingTouches = new Array;\r\n  }\r\n\r\n  mouseRecognitions() {\r\n    this.canvas.addEventListener('mousedown', (event) => {\r\n      this.pressed = true;\r\n\r\n      this.x = event.offsetX;\r\n      this.y = event.offsetY;\r\n    })\r\n\r\n    this.canvas.addEventListener('mouseup', () => {\r\n      this.pressed = false;\r\n\r\n      this.x = undefined;\r\n      this.y = undefined;\r\n    })\r\n\r\n    this.canvas.addEventListener('mousemove', (event) => {\r\n      if(this.pressed) {\r\n\r\n        const x2 = event.offsetX;\r\n        const y2 = event.offsetY;\r\n\r\n        this.drawLine(this.x, this.y, x2, y2)\r\n        this.x = x2;\r\n        this.y = y2;\r\n      }\r\n    })\r\n  }\r\n\r\n  touchRecognitions() {\r\n    this.canvas.addEventListener('touchstart', this.handleStart, false);\r\n    this.canvas.addEventListener('touchend', this.handleEnd, false);\r\n    this.canvas.addEventListener('touchmove', this.handleMove, false);\r\n    this.canvas.addEventListener('touchcancel', this.handleCancel, false);\r\n    this.canvas.addEventListener('touchleave', this.handleLeave, false)\r\n  }\r\n\r\n  // Mobile drawing handlers\r\n\r\n  handleStart(event) {\r\n    const touches = event.changedTouches;\r\n    event.preventDefault();\r\n\r\n    for(let i = 0; i < touches.length; i++) {\r\n      this.ongoingTouches.push(this.copyTouch(touches[i]));\r\n      this.context.beginPath();\r\n      this.context.arc(touches[i].pageX, touches[i].pageY, 4, 0,2*Math.PI, false);\r\n      this.context.fill()\r\n    }\r\n  }\r\n\r\n  handleMove(event) {\r\n    event.preventDefault();\r\n\r\n    const touches = event.changedTouches;\r\n\r\n    for(let i = 0; i < touches.length; i++) {\r\n      const idx = this.ongoingTouchIndexById(touches[i].identifier);\r\n      if(idx >= 0) {\r\n        this.context.beginPath();\r\n        this.context.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);\r\n        this.context.stroke();\r\n\r\n        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));\r\n      } else {\r\n        console.error(\"Can't figure out which touch to continue.\")\r\n      }\r\n    }\r\n  }\r\n\r\n\r\n  // -----------------\r\n\r\n  setup() {\r\n    this.mouseRecognitions();\r\n    this.touchRecognitions();\r\n  }\r\n\r\n  drawLine(x1, y1, x2, y2) {\r\n    this.context.beginPath();\r\n    this.context.moveTo(x1, y1);\r\n    this.context.lineTo(x2,y2);\r\n    this.context.stroke()\r\n  }\r\n  \r\n}\n\n//# sourceURL=webpack://draw/./scripts/modules/sketch.js?");

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