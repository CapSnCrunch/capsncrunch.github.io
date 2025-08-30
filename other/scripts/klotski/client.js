import { renderBoard } from './renderBoard.js';
import { renderGraph, setupGraphEventListeners, getHash, setHash } from './graph.js';
import { setupBoardEventListeners, setBoardString } from './board.js';
import { loadKlotskiData } from './dataLoader.js';
import { color_wheel } from './utils.js';

// Global variables that will be populated from JSON
let nodes_to_use, histogram_non_solutions, histogram_solutions, board_string, rushhour, board_w, board_h;

// Make config globally accessible immediately
window.config = {
    colors: {options:["Distance from Start", "Distance from Solution", "Off"], select:0},
    solutions: {options:["Invisible", "Visible"], select:0},
    path: {options:["Invisible", "Visible"], select:0},
};

// Global variables that need to be accessible
let graphcanvas, graphctx, w, h;
let nodes = {};
let hash = 0;
let save_start_board;

// Board-related variables
let boardcanvas, boardctx;

// Styling variables - moved to global scope
let edgeWidth = 0.5;
let otherNodeRadius = 2;
let currentNodeRadius = 12;
let solutionNodeRadius = 6;

// Initialize the application
async function init() {
    try {
        // Load data from JSON
        const data = await loadKlotskiData();
        console.log('Loaded data:', data);
        
        // Extract variables from loaded data
        nodes_to_use = data.nodes; // Changed from data.nodes_to_use to data.nodes
        histogram_non_solutions = data.histogram_non_solutions;
        histogram_solutions = data.histogram_solutions;
        board_string = data.board_string;
        rushhour = data.rushhour;
        board_w = data.board_w;
        board_h = data.board_h;
        
        console.log('nodes_to_use loaded:', nodes_to_use ? Object.keys(nodes_to_use).length : 'undefined');
        
        // Initialize the rest of the application
        initializeApp();
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Move all the existing initialization code here
function initializeApp() {
    graphcanvas = document.getElementById(`graph`);
    w = graphcanvas.width = window.innerWidth;
    h = graphcanvas.height = window.innerHeight;
    graphctx = graphcanvas.getContext(`2d`);

    boardcanvas = document.getElementById(`board`);
    boardctx = boardcanvas.getContext(`2d`);
    save_start_board = board_string;

    increment_max();

    setup_board();
    
    // Add window resize event listener
    setupResizeHandler();
    
    // Start the animation loop
    animate();
}

function increment_max(){
    console.log('increment_max called, nodes_to_use:', nodes_to_use);
    
    // Safety check - if nodes_to_use is empty or undefined, don't proceed
    if (!nodes_to_use || Object.keys(nodes_to_use).length === 0) {
        console.warn('nodes_to_use is empty or undefined, skipping increment_max');
        return;
    }
    
    var max_x = 0;
    for (const name in nodes_to_use){
        max_x = Math.max(nodes_to_use[name].x, max_x);
    }
    
    console.log('max_x found:', max_x);
    
    for (const name in nodes_to_use){
        let node = nodes_to_use[name];
        nodes[name] = node;
        node.x*=w*.2/max_x;
        node.y*=w*.2/max_x;
        node.z*=w*.2/max_x;
        delete nodes_to_use[name];
    }
    
    console.log('Processed nodes:', Object.keys(nodes).length);
}

// Function to update board when hash changes
function updateBoardForHash(newHash) {
    // Get the node data for the new hash
    const node = nodes[newHash];
    if (!node) {
        console.warn('Node not found for hash:', newHash);
        return;
    }
    
    // Use the representation field which contains the board state
    if (node.representation) {
        setBoardString(node.representation);
        console.log('Updated board to representation:', node.representation, 'for hash:', newHash);
    } else {
        // Fallback to initial board string if no representation
        console.log('Node does not have representation, hash:', newHash);
        setBoardString(board_string);
    }
}

function setup_board() {
    // Setup board event listeners
    setupBoardEventListeners(boardcanvas);
    
    // Setup graph event listeners with a callback that updates the board
    setupGraphEventListeners(
        graphcanvas, 
        nodes, 
        () => {
            // This callback is called when the hash changes
            const currentHash = getHash();
            updateBoardForHash(currentHash);
        }
    );
    
    // Initial board update for current hash
    updateBoardForHash(hash);
}

function render_histogram(){
    var l = histogram_solutions.length;
    var max = 0;
    for(var i = 0; i < l; i++){
        var hns= histogram_non_solutions[i];
        var hs = histogram_solutions[i];
        max = Math.max(max, hns+hs);
    }

    graphctx.globalAlpha = 1;
    for(var i = 0; i < l+1; i++){
        var hns= histogram_non_solutions[i];
        var hs = histogram_solutions[i];
        // Add safety check for nodes[hash]
        var dark = (nodes[hash] && i == nodes[hash].dist) ? 0.5 : 1;
        graphctx.fillStyle = color_wheel(i, dark);
        var bar_width = (hns+hs)*300/max;
        graphctx.fillRect(w-bar_width, h*i/l, bar_width, h/l+1);

        hs = histogram_solutions[i-1];
        dark = (nodes[hash] && i-1 == nodes[hash].dist) ? 0.25 : 0.5;
        graphctx.fillStyle = color_wheel(i-1, dark);
        bar_width = hs*300/max;
        graphctx.fillRect(w-bar_width, h*(i-1)/l, bar_width, h/l+1);
    }
}

function render_graph(){
    renderGraph(
        graphctx, 
        nodes, 
        config, 
        w, 
        h, 
        edgeWidth, 
        solutionNodeRadius, 
        currentNodeRadius, 
        otherNodeRadius
    );
}

function animate(){
    requestAnimationFrame(animate);
    render_graph();
    render_histogram();
}

// Add this new function to handle window resizing
function setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        // Debounce resize events to avoid excessive recalculations
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update canvas dimensions
            w = graphcanvas.width = window.innerWidth;
            h = graphcanvas.height = window.innerHeight;
            
            // Recalculate node positions based on new dimensions
            recalculateNodePositions();
            
            console.log('Window resized to:', w, 'x', h);
        }, 100); // 100ms debounce
    });
}

// Add this new function to recalculate node positions
function recalculateNodePositions() {
    // Find the maximum x coordinate to scale properly
    let max_x = 0;
    for (const name in nodes) {
        max_x = Math.max(nodes[name].x, max_x);
    }
    
    // Scale all nodes based on the new window dimensions
    for (const name in nodes) {
        let node = nodes[name];
        // Store original coordinates before scaling
        if (!node.original_x) {
            node.original_x = node.x;
            node.original_y = node.y;
            node.original_z = node.z;
        }
        
        // Scale based on new window dimensions
        node.x = node.original_x * w * 0.2 / max_x;
        node.y = node.original_y * w * 0.2 / max_x;
        node.z = node.original_z * w * 0.2 / max_x;
    }
}

// Start the application
init();