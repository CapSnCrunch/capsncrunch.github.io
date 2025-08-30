// Board configuration and event handling for Klotski puzzle
// This file manages the board canvas, rendering, and user interactions

// Import required functions from renderBoard.js
import { renderBoard, can_move_piece } from './renderBoard.js';

// Board dimensions and configuration
const N = 4;  // 4x5 board for classic Klotski
const M = 5;
const BOARD_WIDTH = 200; // Width of the board in pixels

// Calculate square size based on board width and number of columns
const SQUARE_SIZE = BOARD_WIDTH / N;

// Board state variables
let boardString = "abbcabbc.dd.efgheijh"; // Initial board state
let boardButton = false;
let boardClickStart = { x: 0, y: 0 };
let diffCoords = { x: 0, y: 0 };
let boardClickSquare = ';';

// Canvas variables - will be set when setupBoardEventListeners is called
let boardCanvas;
let boardCtx; // Add this line to declare boardCtx

// Utility functions
function inBounds(min, val, max) {
    return min <= val && val < max;
}

function movePiece(dy, dx) {
    let boardStringNew = '';
    for (let i = 0; i < N * M; i++) {
        boardStringNew += '.';
    }
    
    for (let y = 0; y < M; y++) {
        for (let x = 0; x < N; x++) {
            const position = y * N + x;
            const letterHere = boardString.charAt(position);
            if (letterHere == boardClickSquare) {
                const target = (y + dy) * N + (x + dx);
                boardStringNew = boardStringNew.slice(0, target) + boardClickSquare + boardStringNew.slice(target + 1);
            } else if (letterHere != '.') {
                boardStringNew = boardStringNew.slice(0, position) + letterHere + boardStringNew.slice(position + 1);
            }
        }
    }
    boardString = boardStringNew;
}

// Render the board using the imported renderBoard function
function renderBoardState() {
    if (!boardCanvas) return;
    
    renderBoard(
        boardCanvas, 
        0, 
        0, 
        N, 
        M, 
        boardString, 
        BOARD_WIDTH,
        boardClickSquare,
        diffCoords,
        0 // rushhour = 0 for Klotski
    );
}

// Helper function to convert screen coordinates to board coordinates
function screenToBoardCoords(screenX, screenY) {
    const canvasWidth = boardCanvas.width;
    const canvasHeight = boardCanvas.height;
    const boardPixelWidth = N * SQUARE_SIZE;
    const boardPixelHeight = M * SQUARE_SIZE;
    
    // Calculate scale factor (same as in renderBoard)
    const scaleX = (canvasWidth * 0.9) / boardPixelWidth;
    const scaleY = (canvasHeight * 0.9) / boardPixelHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate centered position
    const scaledBoardWidth = boardPixelWidth * scale;
    const scaledBoardHeight = boardPixelHeight * scale;
    const centerX = (canvasWidth - scaledBoardWidth) / 2;
    const centerY = (canvasHeight - scaledBoardHeight) / 2;
    
    // Convert screen coordinates to board coordinates
    const boardX = (screenX - centerX) / scale + (N * SQUARE_SIZE) / 2;
    const boardY = (screenY - centerY) / scale + (M * SQUARE_SIZE) / 2;
    
    return { x: boardX, y: boardY };
}

// Event handlers
function handleBoardMouseDown(e) {
    boardButton = true;
    const rect = boardCanvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    const boardCoords = screenToBoardCoords(screenX, screenY);
    boardClickStart = boardCoords;
    
    const x = Math.floor(boardCoords.x / SQUARE_SIZE);
    const y = Math.floor(boardCoords.y / SQUARE_SIZE);
    
    diffCoords = { x: 0, y: 0 };
    boardClickSquare = boardString.charAt(y * N + x);
    
    if (!(inBounds(0, y, M) && inBounds(0, x, N))) {
        boardClickSquare = ';';
    }
    
    renderBoardState();
}

function handleBoardMouseMove(e) {
    if (!boardButton) return;
    
    const rect = boardCanvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    const boardCoords = screenToBoardCoords(screenX, screenY);
    
    diffCoords = {
        x: boardCoords.x - boardClickStart.x,
        y: boardCoords.y - boardClickStart.y
    };
    
    // Constrain to one direction
    if (Math.abs(diffCoords.x) > Math.abs(diffCoords.y)) {
        diffCoords.y = 0;
    } else {
        diffCoords.x = 0;
    }
    
    // Limit movement to one square
    diffCoords.x = Math.min(SQUARE_SIZE, Math.max(-SQUARE_SIZE, diffCoords.x));
    diffCoords.y = Math.min(SQUARE_SIZE, Math.max(-SQUARE_SIZE, diffCoords.y));
    
    renderBoardState();
}

function handleBoardMouseUp() {
    boardButton = false;
    const dx = Math.sign(diffCoords.x);
    const dy = Math.sign(diffCoords.y);
    
    if (can_move_piece(dy, dx, boardClickSquare, boardString, N, M)) {
        movePiece(dy, dx);
    }
    
    boardClickStart = { x: 0, y: 0 };
    diffCoords = { x: 0, y: 0 };
    
    renderBoardState();
    
    // Trigger board change event for external listeners
    if (typeof onBoardChange === 'function') {
        onBoardChange();
    }
}

// Setup event listeners
function setupBoardEventListeners(canvas) {
    // Set canvas references
    boardCanvas = canvas;
    boardCtx = canvas.getContext('2d');
    
    // Remove existing event listeners to prevent duplicates
    canvas.removeEventListener('mousedown', handleBoardMouseDown);
    canvas.removeEventListener('mouseup', handleBoardMouseUp);
    canvas.removeEventListener('mouseleave', handleBoardMouseUp);
    canvas.removeEventListener('mousemove', handleBoardMouseMove);
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleBoardMouseDown, false);
    canvas.addEventListener('mouseup', handleBoardMouseUp, false);
    canvas.addEventListener('mouseleave', handleBoardMouseUp, false);
    canvas.addEventListener('mousemove', handleBoardMouseMove, false);
    
    // Initial render
    renderBoardState();
}

// Public API
function getBoardString() {
    return boardString;
}

function setBoardString(newBoardString) {
    boardString = newBoardString;
    renderBoardState();
}

function resetBoard() {
    boardString = "abbcabbc.dd.efgheijh"; // Reset to initial state
    renderBoardState();
}

// Export functions for use in other modules
export { 
    setupBoardEventListeners,
    getBoardString,
    setBoardString,
    resetBoard,
    movePiece,
    renderBoardState,
    N,
    M,
    BOARD_WIDTH
};
