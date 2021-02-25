/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

const playerBanner = document.getElementById("playerBanner");
const newGameBtn = document.getElementById("newGame");
newGameBtn.addEventListener("click", newGame);
let p1Wins = 0;
let p2Wins = 0;
const winCounter = document.getElementById("winCounter");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  while(board.length){
    board.pop();
  }

  for (let y = 0; y < HEIGHT; y++){
    const curY = [];
    for (let x = 0; x< WIDTH; x++){
      curY.push(null);
    }
    board.push(curY);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {

  const htmlBoard = document.querySelector("#board");

  // Create the row above the board where player selects which column to place piece in
  // create row as tr element, Add event listener to entire row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // top.addEventListener("click", handleClick);

  // create cell for each row as td element, add each cell to row
  // once every cell is added, add row to the dom as a child of the board
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create the actual board, by looping through and creating 
  // each row as tr, then looping through each tr and adding 
  // each cell as td, assigning a standardized id to reference
  // adding each tr to the board div as completed
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function clearHtmlBoard() {
  const pieces = document.querySelectorAll(".piece");
  pieces.forEach((piece) => (piece.remove()))
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y=(HEIGHT-1); y>=0; y--){
    if(board[y][x] === null){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const newPieceDiv = document.createElement('div');
  const properTD = document.getElementById(`${y}-${x}`);
  newPieceDiv.setAttribute('class', `piece p${currPlayer} animated${y} bounceInDown${y}`);
  

  properTD.append(newPieceDiv);  
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  window.alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const top = document.getElementById('column-top');
  let x = +evt.target.id;
  top.removeEventListener("click", handleClick);
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    top.addEventListener("click", handleClick);
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;

  

  // check for win
  setTimeout(() => {
    if (checkForWin()) {
      currPlayer == 1 ? p1Wins++ : p2Wins++;
      winCounter.innerHTML = `<h1>Wins:</h1><h2 class="p1">Player 1</h2>: <h2>${p1Wins}    </h2><h2 class="p2">Player 2</h2><h2>: ${p2Wins}</h2>`
      return endGame(`Player ${currPlayer} won!`);
    }
    if(checkForTie()) {
      return endGame("It's a tie!");
    }
    top.addEventListener("click", handleClick);
    currPlayer = (currPlayer == 1 ? 2 : 1);
    playerBanner.innerText = `It is Player ${currPlayer}'s turn.`;
  }, 200);
}
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  function checkForTie(){
    return board.flat().every((item) => (item!=null));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // loops through each row, then through each cell
  // determines if the cell is a starting point for a win in:
  // a horizontal manner, comparing current cell to the 3 cells to the right
  // a vertical manner, comparing the current cell to the 3 cells below it
  // a diagonal manner, comparing the current cell to the 3 cells down and to the right
  // a diagonal manner, comparing the current cell to the 3 cells down and to the left
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
function newGame(){
  const top = document.getElementById('column-top');
  makeBoard();
  clearHtmlBoard();
  currPlayer = 1;
  playerBanner.innerText = `It is Player ${currPlayer}'s turn.`;
  winCounter.innerHTML = `<h1>Wins:</h1><h2 class="p1">Player 1</h2>: <h2>${p1Wins}    </h2><h2 class="p2">Player 2</h2><h2>: ${p2Wins}</h2>`
  top.addEventListener("click", handleClick);
}
makeHtmlBoard();
newGame();
