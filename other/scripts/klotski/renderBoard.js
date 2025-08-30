// Constants
const EMPTY_SPACE = '.';

// Import utility functions
import { color_wheel, normsin } from './utils.js';

// Utility functions
function in_bounds(min, val, max) {
    return min <= val && val < max;
}

function can_move_piece(dy, dx, board_click_square, board_string, n, m, rushhour = 0) {
    if (rushhour == 1 && (board_click_square.charCodeAt(0) - 'a'.charCodeAt(0) + dy) % 2 == 0) return false;
    for (var y = 0; y < m; y++)
        for (var x = 0; x < n; x++) {
            if (board_string.charAt(y * n + x) == board_click_square) {
                var inside = in_bounds(0, y + dy, m) && in_bounds(0, x + dx, n);
                var target = board_string.charAt((y + dy) * n + (x + dx));
                if (!inside || (target != EMPTY_SPACE && target != board_click_square))
                    return false;
            }
            else continue;
        }
    return true;
}

/* Graphical renderBoard within a canvas given the following parameters:
    canvas: the canvas to render the board on
    x: the x coordinate of the top left corner of the board within the canvas in pixels
    y: the y coordinate of the top left corner of the board within the canvas in pixels
    n: the width of the board in squares
    m: the height of the board in squares
    boardString: the string representation of the board
    boardWidthPixels: the width of the board in pixels
    board_click_square: the character of the piece being dragged (for animation)
    diffcoords: the offset coordinates for piece movement animation
    rushhour: optional parameter for rush hour mode (defaults to 0)
*/
function renderBoard(canvas, x, y, n, m, boardString, boardWidthPixels = 200, board_click_square = ';', diffcoords = {x: 0, y: 0}, rushhour = 0) {
    const ctx = canvas.getContext('2d');
    
    // Clear the entire canvas with a black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate square size based on board width and number of columns
    const squareSize = boardWidthPixels / n;
    const boardHeightPixels = m * squareSize;
    
    // Draw white frame around the board at the provided x, y position
    const borderWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, boardWidthPixels, boardHeightPixels);
    
    // Calculate the inner area (accounting for border width)
    const innerX = x + borderWidth;
    const innerY = y + borderWidth;
    const innerWidth = boardWidthPixels - 2 * borderWidth;
    
    // Add padding between tiles and from edges
    const tilePadding = 7;
    const innerSquareSize = (innerWidth - (n + 1) * tilePadding) / n;
    
    // Draw board pieces
    for (var boardY = 0; boardY < m; boardY++) {
        for (var boardX = 0; boardX < n; boardX++) {
            var spot = boardY * n + boardX;
            var character = boardString.charAt(spot);
            if (character == EMPTY_SPACE) continue;
            
            ctx.fillStyle = color_wheel(72.819 * 2 * character.charCodeAt(0));
            
            // Handle piece movement animation
            var conddiff = (character == board_click_square && can_move_piece(Math.sign(diffcoords.y), Math.sign(diffcoords.x), board_click_square, boardString, n, m, rushhour)) ? diffcoords : {x: 0, y: 0};
            
            // Check if adjacent tiles are part of the same piece
            const leftChar = boardString.charAt(boardY * n + (boardX - 1));
            const rightChar = boardString.charAt(boardY * n + (boardX + 1));
            const topChar = boardString.charAt((boardY - 1) * n + boardX);
            const bottomChar = boardString.charAt((boardY + 1) * n + boardX);
            
            // Calculate tile dimensions - extend to adjacent tiles of the same piece
            const tileWidth = innerSquareSize + 
                (boardX < n - 1 && rightChar == character ? innerSquareSize + tilePadding : 0) +
                (boardX > 0 && leftChar == character ? innerSquareSize + tilePadding : 0);
            
            const tileHeight = innerSquareSize + 
                (boardY < m - 1 && bottomChar == character ? innerSquareSize + tilePadding : 0) +
                (boardY > 0 && topChar == character ? innerSquareSize + tilePadding : 0);
            
            // Only draw if this is the top-left corner of a piece (to avoid drawing the same piece multiple times)
            const shouldDraw = (boardX == 0 || leftChar != character) && (boardY == 0 || topChar != character);
            
            if (shouldDraw) {
                ctx.fillRect(
                    innerX + tilePadding + boardX * (innerSquareSize + tilePadding) + conddiff.x,
                    innerY + tilePadding + boardY * (innerSquareSize + tilePadding) + conddiff.y,
                    tileWidth,
                    tileHeight
                );
            }
        }
    }
}

// Export for ES6 modules
export { renderBoard, in_bounds, can_move_piece, EMPTY_SPACE };
