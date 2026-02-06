"use strict";
let wordList = [];
let randomWord = "";
async function loadWords() {
    const response = await fetch('./5-letter-words.json');
    wordList = await response.json();
    randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log(randomWord);
}
loadWords();
const boardElement = document.getElementById("board");
const keyboardElement = document.getElementById("keyboard");
const h1El = document.querySelector("h1");
let currentRow = 0;
let letter = 0;
let gameOver = false;
if (keyboardElement) {
    for (let row = 0; row < 3; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';
        keyboardElement.appendChild(rowElement);
        if (row == 2) {
            const enterCell = document.createElement('div');
            enterCell.className = "enterCell";
            enterCell.innerHTML = "<img src=\"./assets/enter.png\" alt=\"enter\">";
            enterCell.addEventListener("click", enter);
            rowElement.appendChild(enterCell);
        }
        for (let i = 0; i < 10; i++) {
            if (letter < 26) {
                const cell = document.createElement('div');
                let cellId = String.fromCharCode(65 + letter);
                cell.id = cellId;
                cell.className = 'cell';
                cell.textContent = cellId;
                cell.addEventListener('click', () => clickLetter(cellId));
                rowElement.appendChild(cell);
                letter++;
            }
        }
        if (row == 2) {
            const backspaceCell = document.createElement('div');
            backspaceCell.className = "backspaceCell";
            backspaceCell.innerHTML = "<img src=\"./assets/backspace.png\" alt=\"backspace\">";
            backspaceCell.addEventListener("click", backspace);
            rowElement.appendChild(backspaceCell);
        }
    }
}
if (boardElement) {
    for (let row = 0; row < 6; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';
        boardElement.appendChild(rowElement);
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            rowElement.appendChild(cell);
        }
    }
}
let board = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];
function clickLetter(letter) {
    if (gameOver)
        return;
    for (let col = 0; col < 5; col++) {
        if (board[currentRow][col] === '') {
            board[currentRow][col] = letter;
            const rowElement = boardElement?.querySelectorAll('.row')[currentRow];
            const cellElement = rowElement?.querySelectorAll('.cell')[col];
            if (cellElement) {
                cellElement.textContent = letter;
            }
            break;
        }
    }
}
function typeLetter(key) {
    if (gameOver)
        return;
    for (let col = 0; col < 5; col++) {
        if (board[currentRow][col] === '') {
            board[currentRow][col] = key;
            const rowElement = boardElement?.querySelectorAll('.row')[currentRow];
            const cellElement = rowElement?.querySelectorAll('.cell')[col];
            if (cellElement) {
                cellElement.textContent = key;
            }
            break;
        }
    }
}
function isLetter(char) {
    return /^[a-z]$/i.test(char);
}
function countChar(str, char) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char)
            count++;
    }
    return count;
}
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        enter();
    }
    if (event.key === "Backspace") {
        backspace();
    }
    if (isLetter(event.key)) {
        typeLetter(event.key.toUpperCase());
    }
});
function enter() {
    if (gameOver)
        return;
    let word = board[currentRow].join("");
    if (word.length < 5)
        return;
    if (!wordList.includes(word.toLowerCase()))
        return;
    const rowElements = boardElement?.querySelectorAll('.row');
    const cells = rowElements[currentRow].querySelectorAll('.cell');
    let targetCounts = {};
    for (let char of randomWord) {
        targetCounts[char] = (targetCounts[char] || 0) + 1;
    }
    let letterStatus = new Array(5).fill(0);
    for (let i = 0; i < 5; i++) {
        if (word[i] === randomWord[i]) {
            letterStatus[i] = 2;
            targetCounts[word[i]]--;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (letterStatus[i] === 2)
            continue;
        const char = word[i];
        if (targetCounts[char] > 0) {
            letterStatus[i] = 1;
            targetCounts[char]--;
        }
    }
    for (let i = 0; i < 5; i++) {
        const char = word[i];
        const cellElement = cells[i];
        const keyCell = document.getElementById(char);
        if (letterStatus[i] === 2) {
            cellElement.style.backgroundColor = "green";
            keyCell.style.backgroundColor = "green";
        }
        else if (letterStatus[i] === 1) {
            cellElement.style.backgroundColor = "goldenrod";
            if (keyCell.style.backgroundColor !== "green") {
                keyCell.style.backgroundColor = "goldenrod";
            }
        }
        else {
            cellElement.style.backgroundColor = "#444";
            if (keyCell.style.backgroundColor !== "green" && keyCell.style.backgroundColor !== "goldenrod") {
                keyCell.style.backgroundColor = "#444";
            }
        }
    }
    currentRow++;
    if (currentRow == 6) {
        gameOver = true;
        h1El.innerText = randomWord;
    }
}
function backspace() {
    for (let col = 4; col > -1; col--) {
        if (board[currentRow][col] !== "") {
            const rowElement = boardElement?.querySelectorAll('.row')[currentRow];
            const cellElement = rowElement?.querySelectorAll('.cell')[col];
            cellElement.innerHTML = "";
            board[currentRow][col] = "";
            break;
        }
    }
}
document.getElementById("reset")?.addEventListener("click", reset);
function reset() {
    loadWords();
    currentRow = 0;
    gameOver = false;
    h1El.innerText = "WORDLE";
    const rows = boardElement?.querySelectorAll('.row');
    rows?.forEach(row => {
        row.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "";
        });
    });
    const keyRows = keyboardElement?.querySelectorAll('.row');
    keyRows?.forEach(row => {
        row.querySelectorAll('.cell').forEach(cell => {
            cell.style.backgroundColor = "";
        });
    });
    board = board.map(row => row.fill(""));
}
