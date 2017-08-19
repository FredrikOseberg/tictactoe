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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var tiles = document.querySelectorAll('.tile');
var modal = document.querySelector('.modal');
var turnHeader = document.querySelector('.turn');

var board = [['topLeft', 'topMiddle', 'topRight'], ['middleLeft', 'middleMiddle', 'middleRight'], ['bottomLeft', 'bottomMiddle', 'bottomRight']];
var playerTurn = true;
var playerSymbol = 'X';
var computerSymbol = 'O';
var _gameOver = false;

var eventHandlers = {
	startGame: function startGame() {
		turnHeader.textContent = 'Your turn.';
		playerTurn = true;
		_gameOver = false;
		gameCtrl.resetBoard();
		var playerChosenSymbol = document.querySelector('.player-symbol.active');
		var computerChosenSymbol = document.querySelector('.player-symbol.inactive');
		playerSymbol = playerChosenSymbol.textContent;
		computerSymbol = computerChosenSymbol.textContent;
		UICtrl.hideModal();
	},
	handleTileClick: function handleTileClick(e) {
		var clickedCellContainsSymbol = e.target.textContent === 'X' || e.target.textContent === 'O';
		if (clickedCellContainsSymbol) return;
		if (_gameOver) return;
		if (playerTurn === false) return;
		var boardRow = Number(e.target.dataset.row);
		var boardPosition = Number(e.target.dataset.target);
		placeSymbol(boardRow, boardPosition);
		UICtrl.renderBoard(board);
		playerTurn = false;
		UICtrl.changeTurnHeaderText();
		var validMoves = AI.getMoves(board);
		if (validMoves.length > 0) {
			setTimeout(function delayComputerMove() {
				var ratedMove = AI.minimax(board, computerSymbol);
				AI.placeMove(ratedMove, computerSymbol);
				UICtrl.renderBoard(board);
				var finished = gameCtrl.checkBoardState(board);
				if (!finished) {
					playerTurn = true;
					UICtrl.changeTurnHeaderText();
				} else {
					gameCtrl.gameOver();
				}
			}, 800);
		} else {
			gameCtrl.gameOver();
		}
	},
	handleSymbolButtonClick: function handleSymbolButtonClick(e) {
		var symbolButtons = document.querySelectorAll('.player-symbol');

		if (e.target.classList.contains('active')) return;
		symbolButtons.forEach(function flipClasses(item) {
			if (item.classList.contains('active')) {
				item.classList.remove('active');
				item.classList.add('inactive');
			} else {
				item.classList.add('active');
				item.classList.remove('inactive');
			}
		});
	}
};

var UICtrl = {
	modalGameStartTemplate: function modalGameStartTemplate() {
		return '\n\t\t\t<h1>Welcome to TicTacToe</h1>\n\t\t\t\t<div class="modal-wrapper">\n\t\t\t\t\t<h3>Choose your symbol</h3>\n\t\t\t\t\t<div class="symbols">\n\t\t\t\t\t\t<div class="player-symbol active">X</div>\n\t\t\t\t\t\t<div class="player-symbol inactive">O</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<div class="start-button">Start Game</div>\n\t\t\t</div>';
	},
	modalGameOverTemplate: function modalGameOverTemplate() {
		var tie = AI.tie(board) ? 'tied' : 'lost';
		return '\n\t\t\t<h1>Game over</h1>\n\t\t\t\t<div class="modal-wrapper">\n\t\t\t\t\t<h3 class="outcome">You ' + tie + '</h3>\n\t\t\t\t\t<h3>Choose your symbol</h3>\n\t\t\t\t\t<div class="symbols">\n\t\t\t\t\t\t<div class="player-symbol active">X</div>\n\t\t\t\t\t\t<div class="player-symbol inactive">O</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="start-button">Play again</div>\n\t\t\t</div>';
	},
	renderBoard: function renderBoard(board) {
		tiles.forEach(function addSymbolToBoard(tile) {
			var boardRow = Number(tile.dataset.row);
			var boardPosition = Number(tile.dataset.target);

			var boardPositionIsValidSymbol = board[boardRow][boardPosition] === 'X' || board[boardRow][boardPosition] === 'O';
			if (boardPositionIsValidSymbol) {
				tile.textContent = board[boardRow][boardPosition];
			}
		});
	},
	hideModal: function hideModal() {
		modal.classList.remove('opacity');
		setTimeout(function addOpacityToModal() {
			modal.classList.remove('flex');
		}, 300);
	},
	showModal: function showModal() {
		modal.classList.add('flex');
		setTimeout(function addOpacityToModal() {
			modal.classList.add('opacity');
		}, 300);
	},
	setModalContent: function setModalContent(modalContent) {
		var modal = document.querySelector('.modal-content');
		modal.innerHTML = modalContent;

		var startGame = document.querySelector('.start-button');
		var symbolButtons = document.querySelectorAll('.player-symbol');

		symbolButtons.forEach(function addEventListenerToSymbolButtons(symbol) {
			symbol.addEventListener('click', eventHandlers.handleSymbolButtonClick);
		});

		startGame.addEventListener('click', eventHandlers.startGame);
	},
	showGameOver: function showGameOver() {
		UICtrl.setModalContent(this.modalGameOverTemplate());
		UICtrl.showModal();
		turnHeader.textContent = "Try again!";
	},
	changeTurnHeaderText: function changeTurnHeaderText() {
		if (playerTurn === true) {
			turnHeader.textContent = 'Your turn.';
		} else {
			turnHeader.textContent = 'Computers turn.';
		}
	}
};

var gameCtrl = {
	init: function init() {
		UICtrl.setModalContent(UICtrl.modalGameStartTemplate());
	},
	checkBoardState: function checkBoardState(board) {
		var gameOver = false;
		var availableMoves = AI.getMoves(board);
		if (availableMoves.length === 0) {
			gameOver = true;
		}

		var horizontalRows = AI.getHorizontalRows(board);
		var crossingRows = AI.getCrossingRows(board);
		var verticalRows = [board[0], board[1], board[2]];

		var allRows = [verticalRows, horizontalRows, crossingRows];

		allRows.forEach(function checkForWinner(item) {
			item.forEach(function (rows) {
				var computerCount = 0;
				var playerCount = 0;
				rows.forEach(function checkEachIndividualRow(cell, index) {
					var cellHasComputerSymbol = cell === computerSymbol;
					var cellHasPlayerSymbol = cell === playerSymbol;
					if (cellHasComputerSymbol) {
						computerCount += 1;
					} else if (cellHasPlayerSymbol) {
						playerCount += 1;
					}

					var lastItem = rows.length - 1 === index;
					var computerHasThree = computerCount === 3;
					var playerHasThree = playerCount === 3;
					if (lastItem) {
						if (computerHasThree || playerHasThree) {
							gameOver = true;
						}
					}
				});
			});
		});
		return gameOver;
	},
	gameOver: function gameOver() {
		turnHeader.textContent = "Try again!";
		UICtrl.showGameOver();
		_gameOver = true;
	},
	resetBoard: function resetBoard() {
		board = [['topLeft', 'topMiddle', 'topRight'], ['middleLeft', 'middleMiddle', 'middleRight'], ['bottomLeft', 'bottomMiddle', 'bottomRight']];

		tiles.forEach(function removeTileContent(tile) {
			tile.textContent = "";
		});
	}
};

var AI = {
	getMoves: function getMoves(board) {
		var validMoves = [];
		var moves = [].concat(_toConsumableArray(board[0]), _toConsumableArray(board[1]), _toConsumableArray(board[2]));
		moves.forEach(function checkValidMoves(item) {
			var itemIsValidSymbol = item === 'X' || item === 'O';
			if (!itemIsValidSymbol) {
				validMoves.push(item);
			}
		});

		return validMoves;
	},
	minimax: function minimax(board, player) {
		var availableMoves = AI.getMoves(board);
		var moves = [];

		var computerWon = AI.winning(board, computerSymbol);
		var playerWon = AI.winning(board, playerSymbol);
		var tie = availableMoves.length === 0;
		if (playerWon) {
			return { score: -10 };
		} else if (computerWon) {
			return { score: 10 };
		} else if (tie) {
			return { score: 0 };
		}

		availableMoves.forEach(function findWinningMove(move) {
			var moveRating = {};
			var tempBoard = AI.createTemporaryBoard(board);
			var arrayPosition = AI.getArrayPosition(move);
			var row = arrayPosition[0];
			var position = arrayPosition[1];
			var boardPosition = board[row][position];

			tempBoard[row][position] = player;

			if (player === computerSymbol) {
				var result = AI.minimax(tempBoard, playerSymbol);
				moveRating.score = result.score;
				moveRating.row = row;
				moveRating.position = position;
			} else if (player === playerSymbol) {
				var result = AI.minimax(tempBoard, computerSymbol);
				moveRating.score = result.score;
				moveRating.row = row;
				moveRating.position = position;
			}

			moves.push(moveRating);
		});

		var bestMove;
		var playerIsAI = player === computerSymbol;
		var playerIsHuman = player === playerSymbol;
		if (playerIsAI) {
			moves.forEach(function compareComputerMoves(move, index) {
				if (index === 0) {
					bestMove = AI.setBestMoveProps(move);
				}
				if (move.score > bestMove.score) {
					bestMove = AI.setBestMoveProps(move);
				}
			});
		} else if (playerIsHuman) {
			moves.forEach(function compareComputerMoves(move, index) {
				if (index === 0) {
					bestMove = AI.setBestMoveProps(move);
				}
				if (move.score < bestMove.score) {
					bestMove = AI.setBestMoveProps(move);
				}
			});
		}

		return bestMove;
	},
	setBestMoveProps: function setBestMoveProps(move) {
		var bestMove = {};

		bestMove.score = move.score;
		bestMove.row = move.row;
		bestMove.position = move.position;

		return bestMove;
	},
	placeMove: function placeMove(ratedMove, symbol) {
		board[ratedMove.row][ratedMove.position] = symbol;
	},
	createTemporaryBoard: function createTemporaryBoard(arr) {
		var row1 = [].concat(_toConsumableArray(arr[0]));
		var row2 = [].concat(_toConsumableArray(arr[1]));
		var row3 = [].concat(_toConsumableArray(arr[2]));

		var tempBoard = [row1, row2, row3];
		return tempBoard;
	},
	checkVerticalWinConditions: function checkVerticalWinConditions(tempArr, symbol) {
		for (var i = 0; i < tempArr.length; i++) {
			var count = 0;
			for (var j = 0; j < tempArr[i].length; j++) {
				var cellHasSymbol = tempArr[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				var countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	winning: function winning(tempBoard, player) {
		var winningState = AI.checkVerticalWinConditions(tempBoard, player) || AI.checkHorizontalWinConditions(tempBoard, player) || AI.checkCrossAxisWinConditions(tempBoard, player);

		return winningState;
	},
	tie: function tie(board) {
		var tie, playerWon, computerWon;

		playerWon = AI.winning(board, playerSymbol);
		computerWon = AI.winning(board, computerSymbol);

		var noPlayerWon = playerWon === false && computerWon === false;
		if (noPlayerWon) {
			tie = true;
		} else {
			tie = false;
		}
		return tie;
	},
	checkHorizontalWinConditions: function checkHorizontalWinConditions(tempArr, symbol) {
		var horizontalRows = AI.getHorizontalRows(tempArr);
		for (var i = 0; i < horizontalRows.length; i++) {
			var count = 0;
			for (var j = 0; j < horizontalRows[i].length; j++) {
				var cellHasSymbol = horizontalRows[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				var countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	getHorizontalRows: function getHorizontalRows(arr) {
		var firstHorizontalRow = [arr[0][0], arr[1][0], arr[2][0]];
		var secondHorizontalRow = [arr[0][1], arr[1][1], arr[2][1]];
		var thirdHorizontalRow = [arr[0][2], arr[1][2], arr[2][2]];
		var horizontalRows = [firstHorizontalRow, secondHorizontalRow, thirdHorizontalRow];

		return horizontalRows;
	},
	getCrossingRows: function getCrossingRows(arr) {
		var leftToRightAxis = [arr[0][0], arr[1][1], arr[2][2]];
		var rightToLeftAxis = [arr[0][2], arr[1][1], arr[2][0]];
		var crossAxises = [leftToRightAxis, rightToLeftAxis];

		return crossAxises;
	},
	checkCrossAxisWinConditions: function checkCrossAxisWinConditions(tempArr, symbol) {
		var crossAxises = AI.getCrossingRows(tempArr);

		for (var i = 0; i < crossAxises.length; i++) {
			var count = 0;
			for (var j = 0; j < crossAxises[i].length; j++) {
				var cellHasSymbol = crossAxises[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				var countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	getArrayPosition: function getArrayPosition(move) {
		var result = [];
		var row = void 0;
		var position = void 0;
		if (move === 'topLeft') {
			row = 0;
			position = 0;
		} else if (move === 'topMiddle') {
			row = 0;
			position = 1;
		} else if (move === 'topRight') {
			row = 0;
			position = 2;
		} else if (move === 'middleLeft') {
			row = 1;
			position = 0;
		} else if (move === 'middleMiddle') {
			row = 1;
			position = 1;
		} else if (move === 'middleRight') {
			row = 1;
			position = 2;
		} else if (move === 'bottomLeft') {
			row = 2;
			position = 0;
		} else if (move === 'bottomMiddle') {
			row = 2;
			position = 1;
		} else if (move === 'bottomRight') {
			row = 2;
			position = 2;
		}
		result.push(row, position);
		return result;
	}
};

function placeSymbol(row, position) {
	var turn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'player';

	var boardPositionIsNotSymbol = board[row][position] !== 'X' || board[row][position] !== 'O';
	if (boardPositionIsNotSymbol) {
		board[row][position] = playerSymbol;
	}
}

// Event Listeners
tiles.forEach(function addEventListenerToTile(tile) {
	tile.addEventListener('click', eventHandlers.handleTileClick);
});

gameCtrl.init();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "body {\n\tpadding: 0;\n\tmargin: 0;\n\tfont-family: sans-serif;\n}\n\n.viewport {\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\theight: 100vh;\n\tbackground-color: #fff;\n}\n\n.modal {\n\tposition: fixed;\n\tz-index: 1;\n\tleft: 0;\n\ttop: 0;\n\twidth:100%;\n\theight:100%;\n\toverflow: auto;\n\ttransition: all 0.4s ease;;\n\tbackground-color: rgba(0,0,0);\n\tbackground-color: rgba(0, 0, 0, 0.4);\n\tdisplay: none;\n\topacity: 0;\n\tjustify-content: center;\n\talign-items: center;\n}\n\n.modal-content {\n\tbackground-color: #fff;\n\tborder-radius: 3px;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tflex-direction: column;\n\tmax-width: 450px;\n\twidth: 100%;\n}\n\n.modal-content h1 {\n\tfont-family: 'Sedwick Ave', cursive;\n\tbackground-color:  #ea5555;\n\tcolor: #fff;\n\tmargin-top: 0;\n\tborder-top-left-radius: 3px;\n\tborder-top-right-radius: 3px;\n\twidth: 100%;\n\tpadding: 10px 0;\n\ttext-align: center;\n}\n\n.outcome {\n\tfont-size: 1.7em;\n}\n\n.modal-content h3 {\n\tcolor: #6b6969;\n\ttext-align: center;\n}\n\n.modal-wrapper {\n\tpadding: 10px 40px 40px 40px;\n}\n\n.symbols {\n\tdisplay: flex;\n\tjustify-content: space-between;\n\twidth: 100%;\n\tpadding: 20px 0;\n}\n\n.player-symbol {\n\tpadding: 20px;\n\tborder-radius: 3px;\n\tcursor: pointer;\n}\n\n.player-symbol.active {\n\tbackground-color: #828282;\n\tcolor: #fff;\n\tborder: 1px solid #828282;\n\tborder-radius: 3px;\n}\n\n.player-symbol.inactive {\n\tborder: 1px solid #828282;\n}\n\n.player-symbol.inactive:hover {\n\tbackground-color: #ccc6c6;\n\tcolor: #fff;\n}\n\n.start-button {\n\tpadding: 15px;\n\tmargin-top: 20px;\n\tbackground-color: #ea5555;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tcolor: #fff;\n\tborder-radius: 3px;\n\twidth: 150px;\n\tbox-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);\n\tcursor: pointer;\n}\n\n.flex {\n\tdisplay: flex;\n}\n\n.opacity {\n\topacity: 1;\n}\n\n.turn {\n\tcolor: #828282;\n\tfont-size: 2em;\n\tpadding: 20px;\n}\n\n.board {\n\tposition: relative;\n\twidth: 50%;\n\tmargin: 0 auto;\n\tbackground-color: #ea5555;\n\tpadding: 10px;\n\tmin-width: 400px;\n\tborder-radius: 3px;\n\tbox-shadow: 8px 8px 2px rgba(0, 0, 0, 0.3);\n\tz-index: 0;\n\tmax-width: 400px;\n}\n\n.tile {\n\twidth: 33%;\n\theight: 150px;\n\tborder: 1px solid #fff;\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\tfont-size: 2em;\n\tcolor: #fff;\n}\n\n.tile-group-one,\n.tile-group-two,\n.tile-group-three {\n\tdisplay: flex;\n\tflex: 1;\n}\n\n.tile-group-one .tile {\n\tborder-top: none;\n}\n\n.tile-group-one .tile:first-child {\n\tborder-left: none;\n}\n\n.tile-group-one .tile:last-child {\n\tborder-right: none;\n}\n\n.tile-group-two .tile:first-child {\n\tborder-left: none;\n}\n\n.tile-group-two .tile:last-child {\n\tborder-right: none;\n}\n\n.tile-group-three .tile {\n\tborder-bottom: none;\n}\n\n.tile-group-three .tile:first-child {\n\tborder-left: none;\n}\n\n.tile-group-three .tile:last-child {\n\tborder-right: none;\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);