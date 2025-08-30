const graphcanvas = document.getElementById(`graph`);
const w = graphcanvas.width = window.innerWidth;
const h = graphcanvas.height = window.innerHeight;
const graphctx = graphcanvas.getContext(`2d`);

let tick = 0;
let ox = 0; let oy = 100; let zoom = 1;
let alpha = 0.8; // Horizontal rotation (around Y-axis)
let beta = 0.0;  // Vertical rotation (around X-axis)
let graphbutton = false;
var render_lock = false;
var save_start_board = board_string;

// Add smooth rotation controls
let keys = {};
let rotationSpeed = 0.01; // Reduced for more controlled movement
let lastKeyPress = {}; // Track last key press to prevent multiple triggers
let keyHoldDelay = 200; // Milliseconds before continuous rotation starts
let keyPressTimes = {}; // Track when keys were first pressed

// Mouse rotation controls
let mouseRotation = false;
let lastMouseX = 0;
let lastMouseY = 0;
let mouseRotationSpeed = 0.005; // Adjust for mouse sensitivity

// Styling
let edgeWidth = 0.5;
let otherNodeRadius = 2;
let currentNodeRadius = 12;
let solutionNodeRadius = 6;

// Cursor states
let isPanning = false;

// Mouse position for zoom
let mouseX = 0;
let mouseY = 0;

// Smooth panning animation with springy movement
let panningKeys = {};
let panningStartTimes = {};
let panningVelocities = { 65: 0, 68: 0, 87: 0, 88: 0 }; // Current velocity for each key
let panningAcceleration = 0.8; // How quickly to reach max speed (increased for more responsive feel)
let panningMaxSpeed = 400; // Maximum panning speed
let panningDeceleration = 0.15; // How quickly to slow down when key is released
let lastFrameTime = 0;

var config = {
	colors: {options:["Distance from Start", "Distance from Solution", "Off"], select:0},
    solutions: {options:["Invisible", "Visible"], select:0},
    path: {options:["Invisible", "Visible"], select:0},
};

let nodes = {};

increment_max();

var hash = 0;

function increment_max(){
    var max_x = 0;
    for (const name in nodes_to_use){
        max_x = Math.max(nodes_to_use[name].x, max_x);
    }
    for (const name in nodes_to_use){
        node = nodes_to_use[name];
        nodes[name] = node;
        node.x*=w*.2/max_x;
        node.y*=w*.2/max_x;
        node.z*=w*.2/max_x;
        delete nodes_to_use[name];
    }
}

function render_blurb(){
    graphctx.globalAlpha = 1;
    var y = h - 250;
    graphctx.fillStyle = "white";
    graphctx.font = "16px Arial";
    graphctx.fillText("Configuration", 20, y+=16)
    graphctx.fillText("[c] Colors: " + config.colors.options[config.colors.select], 20, y+=16)
    graphctx.fillText("[s] Show Solutions: " + config.solutions.options[config.solutions.select], 20, y+=16)
    graphctx.fillText("[p] Shortest Path: " + config.path.options[config.path.select], 20, y+=16)
    graphctx.fillText("[r] Reset", 20, y+=16)
    graphctx.fillText("", 20, y+=16)
    graphctx.fillText("This is the Klotski puzzle.", 20, y+=16)
    graphctx.fillText("The right depicts the graph of all positions of the puzzle.", 20, y+=16)
    graphctx.fillText("You can navigate the white circle by sliding pieces in the top left.", 20, y+=16)
    graphctx.fillText("There are a total of 25,955 unique positions.", 20, y+=16)
    graphctx.fillText("Slide pieces to move the large piece to the bottom center.", 20, y+=16)
    graphctx.fillText("Controls: Middle-click and drag to rotate (horizontal and vertical), WASD to pan, arrow keys to pan, mouse wheel to zoom.", 20, y+=16)
    graphctx.fillText("Left-click on any position on the graph to 'teleport' to it.", 20, y+=16)
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
        var dark = i == nodes[hash].dist?.5:1;
        graphctx.fillStyle = color_wheel(i, dark);
        var bar_width = (hns+hs)*300/max;
        graphctx.fillRect(w-bar_width, h*i/l, bar_width, h/l+1);

        hs = histogram_solutions[i-1];
        dark = i-1 == nodes[hash].dist?.25:.5;
        graphctx.fillStyle = color_wheel(i-1, dark);
        bar_width = hs*300/max;
        graphctx.fillRect(w-bar_width, h*(i-1)/l, bar_width, h/l+1);
    }
}

function render_graph() {
    render_lock = true;
    graphctx.globalAlpha = 1;
    graphctx.fillStyle = `Black`;
    graphctx.fillRect(0, 0, w, h);
    graphctx.lineWidth = edgeWidth;
    for (const name in nodes) {
        get_node_coordinates(name);
    }
    
    for (const name in nodes) {
        const node = nodes[name];

        for (const neighbor_name in node.neighbors) {
            const neighbor = nodes[node.neighbors[neighbor_name]];
            if (typeof neighbor == "undefined") {
                continue;
            }

            if (node.dist > neighbor.dist || (node.dist == neighbor.dist && node.x < neighbor.x)) {
                continue;
            }

            if (config.colors.select == 0) {
                graphctx.strokeStyle = color_wheel(node.dist);
            } else if(config.colors.select == 1) {
                graphctx.strokeStyle = color_wheel(node.solution_dist);
            } else {
                graphctx.strokeStyle = "gray";
            }
            graphctx.beginPath();
            graphctx.moveTo(node.screen_x, node.screen_y);
            graphctx.lineTo(neighbor.screen_x, neighbor.screen_y);
            graphctx.stroke();
        }
        
        // Render all nodes as circles
        let nodeRadius = 1; // Default radius for regular nodes
        
        // Determine node color based on the same logic as edges
        let nodeColor;
        if(config.colors.select == 0) nodeColor = color_wheel(node.dist);
        else if(config.colors.select == 1) nodeColor = color_wheel(node.solution_dist);
        else nodeColor = "gray";
        
        // Special styling for solution nodes
        if(config.solutions.select == 1 && node.solution_dist == 0){
            nodeRadius = solutionNodeRadius;
            nodeColor = "white";
        }
        
        // Special styling for current position
        if(name == hash){
            nodeRadius = currentNodeRadius;
            // Draw inner circle with edge color (not white)
            let innerColor;
            if(config.colors.select == 0) innerColor = color_wheel(node.dist);
            else if(config.colors.select == 1) innerColor = color_wheel(node.solution_dist);
            else innerColor = "gray";
            
            graphctx.fillStyle = innerColor;
            graphctx.beginPath();
            graphctx.arc(node.screen_x, node.screen_y, 6, 0, 2*Math.PI);
            graphctx.fill();
            // Draw outer ring (outline) for current position
            graphctx.strokeStyle = "white";
            graphctx.lineWidth = 2;
            graphctx.beginPath();
            graphctx.arc(node.screen_x, node.screen_y, nodeRadius, 0, 2*Math.PI);
            graphctx.stroke();
            // Reset stroke style to prevent affecting edges
            graphctx.lineWidth = edgeWidth;
        } else {
            // Fill other nodes normally
            nodeRadius = otherNodeRadius;
            graphctx.fillStyle = nodeColor;
            graphctx.beginPath();
            graphctx.arc(node.screen_x, node.screen_y, nodeRadius, 0, 2*Math.PI);
            graphctx.fill();
        }
    }

    if(config.path.select == 1){
        var curr_node = nodes[hash];
        while(curr_node.solution_dist != 0){
            for(i in curr_node.neighbors){
                var neighbor = nodes[curr_node.neighbors[i]];
                if(neighbor.solution_dist < curr_node.solution_dist){

                    graphctx.beginPath();
                    graphctx.moveTo(curr_node.screen_x, curr_node.screen_y);
                    graphctx.lineTo(neighbor.screen_x, neighbor.screen_y);
                    graphctx.stroke();

                    curr_node = neighbor;
                    break;
                }
            }
        }
    }
}

function render () {
    if(render_lock) return;

    // Handle smooth panning animation with springy movement
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 16.67; // Normalize to 60fps
    lastFrameTime = currentTime;
    
    // Apply springy panning for each key
    for (const keyCode of [65, 68, 87, 88]) { // A, D, W, X
        if (panningKeys[keyCode]) {
            // Key is pressed - accelerate towards max speed
            panningVelocities[keyCode] += panningAcceleration * deltaTime;
            panningVelocities[keyCode] = Math.min(panningVelocities[keyCode], 1.0); // Clamp to max
        } else {
            // Key is released - decelerate towards zero
            panningVelocities[keyCode] -= panningDeceleration * deltaTime;
            panningVelocities[keyCode] = Math.max(panningVelocities[keyCode], 0.0); // Clamp to min
        }
        
        // Apply movement based on current velocity
        if (panningVelocities[keyCode] > 0.01) { // Only move if velocity is significant
            // Apply easing curve for more natural feel
            const easedVelocity = easeInOutCubic(panningVelocities[keyCode]);
            const panAmount = panningMaxSpeed * easedVelocity * 0.016; // Fixed time step for 60fps
            
            // Apply panning based on key
            switch (keyCode) {
                case 65: // A - pan left
                    ox -= zoom * panAmount;
                    break;
                case 68: // D - pan right
                    ox += zoom * panAmount;
                    break;
                case 87: // W - pan up
                    oy -= zoom * panAmount;
                    break;
                case 88: // X - pan down
                    oy += zoom * panAmount;
                    break;
            }
        }
    }

    // Handle continuous rotation after hold delay
    const now = Date.now();
    if (keys[65] && (now - keyPressTimes[65]) > keyHoldDelay) { // A key - continuous after delay
        alpha -= rotationSpeed * 0.5; // Slower continuous rotation
    }
    if (keys[68] && (now - keyPressTimes[68]) > keyHoldDelay) { // D key - continuous after delay
        alpha += rotationSpeed * 0.5; // Slower continuous rotation
    }

    render_graph();
    render_blurb();
    render_histogram();

    render_lock = false;
}

// Easing function for smooth acceleration and deceleration
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function get_node_coordinates (hash) {
    var node = nodes[hash];
    
    // Apply horizontal rotation (alpha) around Y-axis
    var x_rotated = node.x * Math.cos(alpha) + node.z * Math.sin(alpha);
    var z_rotated = -node.x * Math.sin(alpha) + node.z * Math.cos(alpha);
    
    // Apply vertical rotation (beta) around X-axis
    var y_rotated = node.y * Math.cos(beta) - z_rotated * Math.sin(beta);
    var z_final = node.y * Math.sin(beta) + z_rotated * Math.cos(beta);
    
    // Project to screen coordinates
    nodes[hash].screen_x = (x_rotated - ox) / zoom + w / 2;
    nodes[hash].screen_y = (y_rotated - oy) / zoom + h / 2;
}

function get_closest_node_to (coords) {
    var min_dist = 100000000;
    var best_node = "";
    for (const name in nodes) {
        const node = nodes[name];
        var d = Math.hypot(node.screen_x-coords.x, node.screen_y-coords.y);
        if (d < min_dist) {
            min_dist = d;
            best_node = name;
        }
    }
    console.log(min_dist)
    if(min_dist > 30) return hash;
    return best_node;
}

function color_wheel(angle, brightness=1){
    angle*=0.025;
    var r = normsin(angle)*brightness;
    var g = normsin(angle+Math.PI*2.0/3)*brightness;
    var b = normsin(angle+Math.PI*4.0/3)*brightness;
    return "rgb("+r+","+g+","+b+")";
}

function normsin(angle){
    return Math.floor(128.0*(Math.sin(angle)+1));
}

window.addEventListener(`wheel`,
    (event) => {
        const oldZoom = zoom;
        zoom *= Math.pow(1.1, Math.sign(event.deltaY));
        
        // Calculate zoom factor
        const zoomFactor = zoom / oldZoom;
        
        // Get mouse position relative to canvas
        const rect = graphcanvas.getBoundingClientRect();
        const mouseCanvasX = event.clientX - rect.left;
        const mouseCanvasY = event.clientY - rect.top;
        
        // Calculate world coordinates of mouse position before zoom
        const worldX = (mouseCanvasX - w/2) * oldZoom + ox;
        const worldY = (mouseCanvasY - h/2) * oldZoom + oy;
        
        // Calculate new pan offset to keep mouse at same world position
        ox = worldX - (mouseCanvasX - w/2) * zoom;
        oy = worldY - (mouseCanvasY - h/2) * zoom;
        
        if(!render_lock)render();
    }
);

graphcanvas.addEventListener(`mousedown`, function(e){
    var rect = graphcanvas.getBoundingClientRect();
    var screen_coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    // Check if it's middle-click for rotation
    if (e.button === 1) { // Middle click (center mouse button)
        mouseRotation = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        document.body.style.cursor = 'grab'; // Show hand cursor when rotating
        e.preventDefault();
    } else if (e.button === 0) { // Left click for teleporting
        graphbutton = true;
        board_string = nodes[get_closest_node_to(screen_coords)].representation;
        on_board_change();
    }
}, false);

graphcanvas.addEventListener(`mouseup`, function(e){
    if (e.button === 1) { // Middle click
        mouseRotation = false;
        document.body.style.cursor = 'default'; // Reset cursor when rotation ends
    } else if (e.button === 0) { // Left click
        graphbutton = false;
    }
}, false);

graphcanvas.addEventListener(`mousemove`, function(e){
    if (mouseRotation) {
        var deltaX = e.clientX - lastMouseX;
        var deltaY = e.clientY - lastMouseY;
        
        // Scale rotation speed based on zoom level - more precise when zoomed in
        const zoomAdjustedSpeed = mouseRotationSpeed / (zoom ** (1/3));
        
        // Rotate based on mouse movement (reversed horizontal direction)
        alpha -= deltaX * zoomAdjustedSpeed; // Reversed direction
        beta += deltaY * zoomAdjustedSpeed; // Add vertical rotation
        
        // Clamp vertical rotation to prevent flipping
        beta = Math.max(-Math.PI/2, Math.min(Math.PI/2, beta));
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        if(!render_lock) render();
    } else if(graphbutton) {
        var rect = graphcanvas.getBoundingClientRect();
        var screen_coords = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
}, false);

// Prevent context menu on right click
graphcanvas.addEventListener(`contextmenu`, function(e){
    e.preventDefault();
}, false);

// Track mouse position for zoom
graphcanvas.addEventListener(`mousemove`, function(e){
    var rect = graphcanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}, false);

window.addEventListener(`keydown`, key, false);
window.addEventListener(`keyup`, keyup, false);

function key (e) {
    const c = e.keyCode;
    console.log(c + " " + "r".charCodeAt(0));
    
    // Handle panning with WASD keys - track key states for smooth animation
    if (c == 65 || c == 68 || c == 87 || c == 88) { // WASD keys
        if (!panningKeys[c]) {
            panningKeys[c] = true;
            panningStartTimes[c] = Date.now();
            // Don't reset velocity - let it build up naturally
        }
    }
    
    // Handle other controls
    if (c == 37) ox -= zoom * 100; // Left arrow
    if (c == 38) oy -= zoom * 100; // Up arrow
    if (c == 39) ox += zoom * 100; // Right arrow
    if (c == 40) oy += zoom * 100; // Down arrow
    if (c == 67) config.colors.select = (config.colors.select+1)%config.colors.options.length;
    if (c == 83) config.solutions.select = (config.solutions.select+1)%config.solutions.options.length;
    if (c == 80) config.path.select = (config.path.select+1)%config.path.options.length;
    if (c == 82) board_string = save_start_board;
    on_board_change();
}

function keyup (e) {
    const c = e.keyCode;
    keys[c] = false; // Track key release
    
    // Handle panning key release
    if (c == 65 || c == 68 || c == 87 || c == 88) { // WASD keys
        panningKeys[c] = false;
        // Don't reset velocity - let it decay naturally
    }
}



var square_sz = 25;

const boardcanvas = document.getElementById(`board`);

// Let the canvas use the CSS dimensions (100% width/height of its container)
// The actual canvas dimensions will be set by the browser based on the CSS
const boardctx = boardcanvas.getContext(`2d`);

let boardbutton = false;
let board_click_start = {x:0,y:0};
let diffcoords = {x:0,y:0};
let board_click_square = ';';

setInterval(render_board, 10);

var EMPTY_SPACE = '.';

hash = get_hash();
if(!render_lock)render();

function render_board () {
    for(i = 0; i < 3; i++){
        boardctx.fillStyle = ([`#000`, `#222`, `#000`])[i];
        var margin = i*square_sz/5;
        boardctx.fillRect(0+margin, 0+margin, boardcanvas.width-2*margin, boardcanvas.height-2*margin);
    }
    for (var y = 0; y < board_h; y++){
        for (var x = 0; x < board_w; x++){
            var spot = y*board_w+x;
            var charcode = board_string.charCodeAt(spot);
            var character = board_string.charAt(spot);
            if(character == EMPTY_SPACE) continue;
            boardctx.fillStyle = color_wheel(72.819*2*charcode);
            var conddiff = (character == board_click_square && can_move_piece(Math.sign(diffcoords.y), Math.sign(diffcoords.x)))?diffcoords:{x:0,y:0};
            boardctx.fillRect(boardcanvas.width/2+(x-board_w/2)*square_sz+conddiff.x,boardcanvas.height/2+(y-board_h/2)*square_sz+conddiff.y,square_sz,square_sz);
        }
    }
}

function in_bounds(min, val, max){ return min <= val && val < max; }

function can_move_piece(dy, dx){
    if(rushhour==1 && (board_click_square.charCodeAt(0) - 'a'.charCodeAt(0) + dy)%2==0) return false;
    for(var y = 0; y < board_h; y++)
        for(var x = 0; x < board_w; x++){
            if(board_string.charAt(y*board_w+x) == board_click_square) {
                var inside = in_bounds(0, y+dy, board_h) && in_bounds(0, x+dx, board_w);
                var target = board_string.charAt((y+dy)*board_w+(x+dx));
                if(!inside || (target != EMPTY_SPACE && target != board_click_square))
                    return false;
            }
            else continue;
        }
    return true;
}

function move_piece(dy, dx){
    var board_string_new = '';
    for(var i = 0; i < w*h; i++)board_string_new += ".";
    for(var y = 0; y < board_h; y++)
        for(var x = 0; x < board_w; x++){
            var position = y*board_w+x;
            var letter_here = board_string.charAt(position);
            if(letter_here == board_click_square) {
                var target = (y+dy)*board_w+(x+dx);
                board_string_new = board_string_new.slice(0, target) + board_click_square + board_string_new.slice(target+1);
            }
            else if(letter_here != EMPTY_SPACE)
                board_string_new = board_string_new.slice(0, position) + letter_here + board_string_new.slice(position+1);
        }
    board_string = board_string_new;
}

function on_board_change(){
    hash = get_hash();
    if(!render_lock)render();
}

var board_release = function(){
    boardbutton = false;
    var dx = Math.sign(diffcoords.x);
    var dy = Math.sign(diffcoords.y);
    if(can_move_piece(dy, dx)) move_piece(dy, dx);
    board_click_start = {x:0,y:0};
    diffcoords = {x:0,y:0};
    on_board_change();
}

boardcanvas.addEventListener(`mousedown`, function(e){
    boardbutton = true;
    var rect = boardcanvas.getBoundingClientRect();
    board_click_start = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    var x = Math.floor(((board_click_start.x - boardcanvas.width/2)/square_sz)+board_w/2);
    var y = Math.floor(((board_click_start.y - boardcanvas.height/2)/square_sz)+board_h/2);
    diffcoords = {x:0,y:0};
    board_click_square = board_string.charAt(x+y*board_w);
    if(!(in_bounds(0, y, board_h) && in_bounds(0, x, board_w))) board_click_square = ';';
}, false);
boardcanvas.addEventListener(`mouseup`, board_release, false);
boardcanvas.addEventListener(`mouseleave`, board_release, false);
boardcanvas.addEventListener(`mousemove`, function(e){
    if(!boardbutton) return;
    var rect = boardcanvas.getBoundingClientRect();
    var screen_coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    diffcoords = {
        x:screen_coords.x-board_click_start.x,
        y:screen_coords.y-board_click_start.y
    };
    if(Math.abs(diffcoords.x) > Math.abs(diffcoords.y))
        diffcoords.y = 0;
    else
        diffcoords.x = 0;
    diffcoords.x = Math.min(square_sz, Math.max(-square_sz, diffcoords.x));
    diffcoords.y = Math.min(square_sz, Math.max(-square_sz, diffcoords.y));
}, false);

function get_hash() {
    var semihash = 0;
    var obj = {"a":0, "b":0, "c":0, "d":0, "e":0, "f":0, "g":0, "h":0, "i":0, "j":0, "k":0, "l":0, "m":0, "n":0, "o":0, "p":0, "q":0, "r":0, "s":0, "t":0, "u":0, "v":0, "w":0, "x":0, "y":0, "z":0}
    var sum = 0;
    for(var y = 0; y < board_h; y++)
        for(var x = 0; x < board_w; x++){
            var letter = board_string.charAt(y*board_w+x);
            if(letter != EMPTY_SPACE){
                var i=y*board_w+x;
                obj[letter] += Math.sin((i+1)*Math.cbrt(i+2));
            }
        }
    for(letter in obj) semihash+=Math.cbrt(obj[letter]);

    var closedist = 10000;
    var closename = 0;
    for(name in nodes){
        var dist = Math.abs(semihash-name);
        if(dist < closedist){
            closename = name;
            closedist = dist;
        }
    }
    return closename;
}


