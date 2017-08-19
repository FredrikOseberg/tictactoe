"use strict";

import './css/style.css';

var tiles = document.querySelectorAll('.tile');
var modal = document.querySelector('.modal');
var turnHeader = document.querySelector('.turn');


var board = [
	['topLeft', 'topMiddle', 'topRight'],
	['middleLeft', 'middleMiddle', 'middleRight'],
	['bottomLeft', 'bottomMiddle', 'bottomRight']
];
var playerTurn = true;
var playerSymbol = 'X';
var computerSymbol = 'O';
var gameOver = false;

var eventHandlers = {
	startGame: function() {
		turnHeader.textContent = 'Your turn.';
		playerTurn = true;
		gameOver = false;
		gameCtrl.resetBoard();
		var playerChosenSymbol = document.querySelector('.player-symbol.active');
		var computerChosenSymbol = document.querySelector('.player-symbol.inactive');
		playerSymbol = playerChosenSymbol.textContent;
		computerSymbol = computerChosenSymbol.textContent;
		UICtrl.hideModal();
	},
	handleTileClick: function(e) {
		const clickedCellContainsSymbol = e.target.textContent === 'X' || e.target.textContent === 'O';
		if (clickedCellContainsSymbol) return;
		if (gameOver) return;
		if (playerTurn === false) return;
		const boardRow = Number(e.target.dataset.row);
		const boardPosition = Number(e.target.dataset.target);
		placeSymbol(boardRow, boardPosition);
		UICtrl.renderBoard(board);
		playerTurn = false;
		UICtrl.changeTurnHeaderText();
		const validMoves = AI.getMoves(board);
		if (validMoves.length > 0) {
			setTimeout(function delayComputerMove() {
				const ratedMove = AI.minimax(board, computerSymbol);
				AI.placeMove(ratedMove, computerSymbol);
				UICtrl.renderBoard(board);
				const finished = gameCtrl.checkBoardState(board);
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
	handleSymbolButtonClick: function(e) {
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
}

var UICtrl = {
	modalGameStartTemplate: function() {
		return `
			<h1>Welcome to TicTacToe</h1>
				<div class="modal-wrapper">
					<h3>Choose your symbol</h3>
					<div class="symbols">
						<div class="player-symbol active">X</div>
						<div class="player-symbol inactive">O</div>
					</div>
					
					<div class="start-button">Start Game</div>
			</div>`;
	},
	modalGameOverTemplate: function() {
		var tie = AI.tie(board) ? 'tied' : 'lost'
		return `
			<h1>Game over</h1>
				<div class="modal-wrapper">
					<h3 class="outcome">You ${tie}</h3>
					<h3>Choose your symbol</h3>
					<div class="symbols">
						<div class="player-symbol active">X</div>
						<div class="player-symbol inactive">O</div>
					</div>
					<div class="start-button">Play again</div>
			</div>`;
	},
	renderBoard: function(board) {
		tiles.forEach(function addSymbolToBoard(tile) {
			const boardRow = Number(tile.dataset.row);
			const boardPosition = Number(tile.dataset.target);

			const boardPositionIsValidSymbol = board[boardRow][boardPosition] === 'X' || board[boardRow][boardPosition] === 'O';
			if (boardPositionIsValidSymbol) {
				tile.textContent = board[boardRow][boardPosition];
			}
		});
	},
	hideModal: function() {
		modal.classList.remove('opacity');
		setTimeout(function addOpacityToModal() {
			modal.classList.remove('flex');
		}, 300);
	},
	showModal: function() {
		modal.classList.add('flex');
		setTimeout(function addOpacityToModal() {
			modal.classList.add('opacity');
		}, 300);
	},
	setModalContent: function(modalContent) {
		const modal = document.querySelector('.modal-content');
		modal.innerHTML = modalContent;

		var startGame = document.querySelector('.start-button');
		var symbolButtons = document.querySelectorAll('.player-symbol');

		symbolButtons.forEach(function addEventListenerToSymbolButtons(symbol) {
			symbol.addEventListener('click', eventHandlers.handleSymbolButtonClick);
		});

		startGame.addEventListener('click', eventHandlers.startGame);
	},
	showGameOver: function() {
		UICtrl.setModalContent(this.modalGameOverTemplate());
		UICtrl.showModal();
		turnHeader.textContent = "Try again!";
	},
	changeTurnHeaderText: function() {
		if (playerTurn === true) {
			turnHeader.textContent = 'Your turn.';
		} else {
			turnHeader.textContent = 'Computers turn.';
		}
	}
}

var gameCtrl = {
	init: function() {
		UICtrl.setModalContent(UICtrl.modalGameStartTemplate());
	},
	checkBoardState: function(board) {
		let gameOver = false;
		let availableMoves = AI.getMoves(board);
		if (availableMoves.length === 0) { gameOver = true; }

		const horizontalRows = AI.getHorizontalRows(board);
		const crossingRows = AI.getCrossingRows(board);
		const verticalRows = [board[0], board[1], board[2]];

		let allRows = [verticalRows, horizontalRows, crossingRows];

		allRows.forEach(function checkForWinner(item) {
			item.forEach(function (rows) {
				let computerCount = 0;
				let playerCount = 0;
				rows.forEach(function checkEachIndividualRow(cell, index) {
					const cellHasComputerSymbol = cell === computerSymbol;
					const cellHasPlayerSymbol = cell === playerSymbol;
					if (cellHasComputerSymbol) {
						computerCount += 1;
					} else if (cellHasPlayerSymbol) {
						playerCount += 1;
					}

					const lastItem = rows.length - 1 === index;
					const computerHasThree = computerCount === 3;
					const playerHasThree = playerCount === 3;
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
	gameOver: function() {
		turnHeader.textContent = "Try again!";
		UICtrl.showGameOver();
		gameOver = true;
	},
	resetBoard: function() {
		board = [
			['topLeft', 'topMiddle', 'topRight'],
			['middleLeft', 'middleMiddle', 'middleRight'],
			['bottomLeft', 'bottomMiddle', 'bottomRight']
		];

		tiles.forEach(function removeTileContent(tile) {
			tile.textContent = "";
		});
	}
}


var AI = {
	getMoves: function(board) {
		const validMoves = [];
		const moves = [...board[0], ...board[1], ...board[2]];
		moves.forEach(function checkValidMoves(item) {
			const itemIsValidSymbol = item === 'X' || item === 'O';
			if (!itemIsValidSymbol) {
				validMoves.push(item);
			}
		});

		return validMoves;
	},
	minimax: function(board, player) {
		var availableMoves = AI.getMoves(board);
		var moves = [];

		const computerWon = AI.winning(board, computerSymbol);
		const playerWon = AI.winning(board, playerSymbol);
		const tie = availableMoves.length === 0;
		if (playerWon) {
			return { score: -10 };
		} else if (computerWon) {
			return { score: 10 }
		} else if (tie) {
			return { score: 0 }
		}

		availableMoves.forEach(function findWinningMove(move) {
			let moveRating = {};
			const tempBoard = AI.createTemporaryBoard(board);
			const arrayPosition = AI.getArrayPosition(move);
			const row = arrayPosition[0];
			const position = arrayPosition[1];
			const boardPosition = board[row][position];

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
		const playerIsAI = player === computerSymbol;
		const playerIsHuman = player === playerSymbol;
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
	setBestMoveProps: function(move) {
		let bestMove = {};

		bestMove.score = move.score;
		bestMove.row = move.row;
		bestMove.position = move.position;

		return bestMove;
	},
	placeMove: function(ratedMove, symbol) {
		board[ratedMove.row][ratedMove.position] = symbol;
	},
	createTemporaryBoard: function(arr) {
		const row1 = [...arr[0]];
		const row2 = [...arr[1]];
		const row3 = [...arr[2]];

		const tempBoard = [row1, row2, row3];
		return tempBoard;
	},
	checkVerticalWinConditions: function(tempArr, symbol) {
		for (let i = 0; i < tempArr.length; i++) {
			let count = 0;
			for (let j = 0; j < tempArr[i].length; j++) {
				const cellHasSymbol = tempArr[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				const countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	winning: function(tempBoard, player) {
		const winningState = AI.checkVerticalWinConditions(tempBoard, player)
						|| AI.checkHorizontalWinConditions(tempBoard, player)
						|| AI.checkCrossAxisWinConditions(tempBoard, player);

		return winningState;
	},
	tie: function(board) {
		var tie, playerWon, computerWon;

		playerWon = AI.winning(board, playerSymbol);
		computerWon = AI.winning(board, computerSymbol);

		const noPlayerWon = playerWon === false && computerWon === false;
		if ( noPlayerWon ) {
			tie = true;
		} else {
			tie = false;
		}
		return tie;
	},	
	checkHorizontalWinConditions: function(tempArr, symbol) {
		const horizontalRows = AI.getHorizontalRows(tempArr);
		for (var i = 0; i < horizontalRows.length; i++) {
			let count = 0;
			for (var j = 0; j < horizontalRows[i].length; j++) {
				const cellHasSymbol = horizontalRows[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				const countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	getHorizontalRows: function(arr) {
		const firstHorizontalRow = [arr[0][0], arr[1][0], arr[2][0]];
		const secondHorizontalRow = [arr[0][1], arr[1][1], arr[2][1]];
		const thirdHorizontalRow = [arr[0][2], arr[1][2], arr[2][2]]
		const horizontalRows = [firstHorizontalRow, secondHorizontalRow, thirdHorizontalRow];

		return horizontalRows
	},
	getCrossingRows: function (arr) {
		const leftToRightAxis = [arr[0][0], arr[1][1], arr[2][2]];
		const rightToLeftAxis = [arr[0][2], arr[1][1], arr[2][0]];
		const crossAxises = [leftToRightAxis, rightToLeftAxis];

		return crossAxises;
	},
	checkCrossAxisWinConditions: function(tempArr, symbol) {
		const crossAxises = AI.getCrossingRows(tempArr);

		for (var i = 0; i < crossAxises.length; i++) {
			let count = 0;
			for (var j = 0; j < crossAxises[i].length; j++) {
				const cellHasSymbol = crossAxises[i][j] === symbol;
				if (cellHasSymbol) {
					count += 1;
				}
				const countIsThree = count === 3;
				if (countIsThree) {
					return true;
				}
			}
		}
		return false;
	},
	getArrayPosition: function(move) {
		let result = [];
		let row;
		let position;
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
}

function placeSymbol(row, position, turn = 'player') {
	const boardPositionIsNotSymbol = board[row][position] !== 'X' || board[row][position] !== 'O';
	if (boardPositionIsNotSymbol) {
		board[row][position] = playerSymbol;
	}
}

// Event Listeners
tiles.forEach(function addEventListenerToTile(tile) { 
	tile.addEventListener('click', eventHandlers.handleTileClick);
});

gameCtrl.init();

