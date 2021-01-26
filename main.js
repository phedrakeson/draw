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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_sketch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/sketch.js */ \"./scripts/modules/sketch.js\");\n\n\nconst sketch = new _modules_sketch_js__WEBPACK_IMPORTED_MODULE_0__.default('sketch');\n\nsketch.draw();\n\n\n//# sourceURL=webpack://draw/./scripts/main.js?");

/***/ }),

/***/ "./scripts/modules/sketch.js":
/*!***********************************!*\
  !*** ./scripts/modules/sketch.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ Sketch\n/* harmony export */ });\nclass Sketch {\n  constructor(canvas) {\n    this.canvas = document.getElementById(canvas)\n    this.context = this.canvas.getContext('2d')\n  }\n\n  setup() {\n\n  }\n\n  draw() {\n    // this.context.fillStyle = \"rgb(200,0,0)\"\n    // this.context.fillRect (10, 10, 55, 50);\n\n    // this.context.fillStyle = \"rgba(0, 0, 200, 0.5)\";\n    // this.context.fillRect (30, 30, 55, 50);\n\n    // this.context.fillRect(25, 25, 100, 100)\n    // this.context.clearRect(45, 45, 60, 60)\n    // this.context.strokeRect(50, 50, 50, 50)\n\n\n    this.context.beginPath()\n    this.context.moveTo(200, 300)\n    this.context.lineTo(220, 325)\n    this.context.lineTo(220, 275)\n    this.context.fill()\n\n\n    this.context.beginPath();\n    this.context.arc(75, 75, 50, 0, Math.PI * 2, true); // Círculo exterior\n    this.context.moveTo(110, 75);\n    this.context.arc(75, 75, 35, 0, Math.PI, false);  // Boca (sentido horário)\n    this.context.moveTo(65, 65);\n    this.context.arc(60, 65, 5, 0, Math.PI * 2, true);  // Olho esquerdo\n    this.context.moveTo(95, 65);\n    this.context.arc(90, 65, 5, 0, Math.PI * 2, true);  // Olho direito\n    this.context.stroke();\n\n     // Stroked triangle\n     this.context.beginPath();\n     this.context.moveTo(125,125);\n     this.context.lineTo(125,45);\n     this.context.lineTo(45,125);\n     this.context.closePath();\n     this.context.stroke();\n\n     this.context.beginPath()\n     this.context.moveTo(200,200)\n     this.context.lineTo(200, 300)\n     this.context.lineTo(200, 400)\n     this.context.stroke()\n  }\n  \n}\n\n//# sourceURL=webpack://draw/./scripts/modules/sketch.js?");

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