// Graph rendering functions for Klotski puzzle visualization

// Import utility functions
import { color_wheel } from './utils.js';

// Graph state variables - these are now local to this module
let hash = 0;
let alpha = 0.8; // Horizontal rotation (around Y-axis)
let beta = 0.0;  // Vertical rotation (around X-axis)
let ox = 0;
let oy = 0; // Start at 0, will be adjusted based on device
let zoom = 1;

// Function to initialize graph positioning based on device
function initializeGraphPosition() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Better centering for mobile - adjust vertical position
        oy = 50; // Move view up slightly (positive oy moves view down)
        zoom = 1.5; // Slightly zoomed in for mobile
    } else {
        // Desktop positioning
        oy = 100;
        zoom = 1;
    }
}

// Function to get node coordinates with 3D transformations
function get_node_coordinates(hash, nodes, alpha, beta, ox, oy, zoom, w, h) {
    var node = nodes[hash];
    
    // Apply horizontal rotation (alpha) around Y-axis
    var x_rotated = node.x * Math.cos(alpha) + node.z * Math.sin(alpha);
    var z_rotated = -node.x * Math.sin(alpha) + node.z * Math.cos(alpha);
    
    // Apply vertical rotation (beta) around X-axis
    var y_rotated = node.y * Math.cos(beta) - z_rotated * Math.sin(beta);
    var z_final = node.y * Math.sin(beta) + z_rotated * Math.cos(beta);
    
    // Project to screen coordinates - fix zoom direction
    nodes[hash].screen_x = (x_rotated - ox) * zoom + w / 2;
    nodes[hash].screen_y = (y_rotated - oy) * zoom + h / 2;
}

/* Render graph within a canvas given the following parameters:
    graphctx: the canvas context to render the graph on
    nodes: the nodes data structure
    config: configuration object for colors and display options
    w: canvas width
    h: canvas height
    edgeWidth: width of edges
    solutionNodeRadius: radius for solution nodes
    currentNodeRadius: radius for current node
    otherNodeRadius: radius for other nodes
*/
function renderGraph(graphctx, nodes, config, w, h, edgeWidth, solutionNodeRadius, currentNodeRadius, otherNodeRadius) {
    graphctx.globalAlpha = 1;
    graphctx.fillStyle = `Black`;
    graphctx.fillRect(0, 0, w, h);
    graphctx.lineWidth = edgeWidth;
    
    // Calculate screen coordinates for all nodes
    for (const name in nodes) {
        get_node_coordinates(name, nodes, alpha, beta, ox, oy, zoom, w, h);
    }
    
    // Render edges
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
        
        // Render all nodes as circles - use the pre-scaled radii passed in
        let nodeRadius = otherNodeRadius; // Default radius for regular nodes
        
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
        
        // Special styling for highlighted distance nodes (from histogram hover)
        if(config.highlightDistance.enabled && node.solution_dist == config.highlightDistance.value){
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
            
            // Make inner radius smaller to create a proper white ring
            let innerRadius = nodeRadius * 0.7; // Inner circle is 70% of outer radius
            
            graphctx.fillStyle = innerColor;
            graphctx.beginPath();
            graphctx.arc(node.screen_x, node.screen_y, innerRadius, 0, 2*Math.PI);
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
            graphctx.fillStyle = nodeColor;
            graphctx.beginPath();
            graphctx.arc(node.screen_x, node.screen_y, nodeRadius, 0, 2*Math.PI);
            graphctx.fill();
        }
    }

    // Render solution path if enabled
    if(config.path.select == 1){
        var curr_node = nodes[hash];
        // Add safety check to ensure curr_node exists
        if(curr_node){
            // Set up white stroke for the path
            graphctx.strokeStyle = "white";
            graphctx.lineWidth = 3; // Make the path more visible
            
            while(curr_node.solution_dist != 0){
                for(var i in curr_node.neighbors){
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
            
            // Reset stroke style to prevent affecting other rendering
            graphctx.lineWidth = edgeWidth;
        }
    }
}

/* Setup graph event listeners for interaction
    graphcanvas: the canvas element for the graph
    nodes: the nodes data structure
    get_closest_node_to: function to find closest node to screen coordinates
    setup_board: function to update the board when hash changes
*/
function setupGraphEventListeners(graphcanvas, nodes, onHashChange) {
    // Mouse rotation controls
    let mouseRotation = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseRotationSpeed = 0.0035; // Adjust for mouse sensitivity

    // Touch controls for mobile
    let touchStartDistance = 0;
    let touchStartCenter = { x: 0, y: 0 };
    let touchStartAlpha = 0;
    let touchStartBeta = 0;
    let touchStartOx = 0;
    let touchStartOy = 0;
    let touchStartZoom = 1; // Add this variable
    let isPinching = false;
    let isPanning = false;
    let isRotating = false;

    // Keyboard panning controls
    let panningSpeed = 15; // Reduced from 50 to 2 for much slower panning
    let keys = {};

    // Track key states
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Handle panning in animation loop
    function handlePanning() {
        if (keys['w']) oy -= panningSpeed;
        if (keys['s']) oy += panningSpeed;
        if (keys['a']) ox -= panningSpeed;
        if (keys['d']) ox += panningSpeed;
    }

    // Set up animation loop for smooth panning
    function panningLoop() {
        handlePanning();
        requestAnimationFrame(panningLoop);
    }
    panningLoop();

    // Mouse event listeners
    graphcanvas.addEventListener('mousedown', (e) => {
        if (e.button === 1) { // Middle mouse button
            mouseRotation = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            graphcanvas.style.cursor = 'grab'; // Set grab cursor when middle mouse is pressed
        }
    });
    
    graphcanvas.addEventListener('mouseup', (e) => {
        if (e.button === 1) {
            mouseRotation = false;
            graphcanvas.style.cursor = 'default'; // Reset cursor when middle mouse is released
        }
    });
    
    graphcanvas.addEventListener('mousemove', (e) => {
        if (mouseRotation) {
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;
            alpha += deltaX * mouseRotationSpeed;
            beta -= deltaY * mouseRotationSpeed;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });
    
    // Mouse wheel zoom
    graphcanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Inverted zoom factors
        zoom *= zoomFactor;
        zoom = Math.max(0.1, Math.min(10, zoom));
    });
    
    // Click to teleport
    graphcanvas.addEventListener('click', (e) => {
        // Only handle click if not touching (to avoid conflicts with touch events)
        if (e.pointerType === 'mouse') {
            const rect = graphcanvas.getBoundingClientRect();
            const scaleX = graphcanvas.width / rect.width;
            const scaleY = graphcanvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            const closestNode = get_closest_node_to({x, y}, nodes);
            if (closestNode !== hash) {
                hash = closestNode;
                // Call the callback to notify that hash has changed
                if (onHashChange) {
                    onHashChange();
                }
            }
        }
    });

    // Touch event listeners for mobile
    graphcanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // Two finger gesture - pinch to zoom
            isPinching = true;
            
            // Calculate initial distance between fingers
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            touchStartDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            
            // Store initial zoom
            touchStartZoom = zoom;
            
        } else if (e.touches.length === 1) {
            // Single finger - rotation (equivalent to middle mouse button)
            isRotating = true;
            const touch = e.touches[0];
            lastMouseX = touch.clientX;
            lastMouseY = touch.clientY;
            touchStartAlpha = alpha;
            touchStartBeta = beta;
        }
    });

    graphcanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 2 && isPinching) {
            // Handle pinch zoom to center
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            // Calculate current distance
            const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
            
            // Handle zoom with slower speed
            if (touchStartDistance > 0) {
                const zoomFactor = Math.pow(currentDistance / touchStartDistance, 0.5); // Slower zoom
                const newZoom = touchStartZoom * zoomFactor;
                zoom = Math.max(0.1, Math.min(10, newZoom));
            }
            
        } else if (e.touches.length === 1 && isRotating) {
            // Handle single finger rotation
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastMouseX;
            const deltaY = touch.clientY - lastMouseY;
            
            alpha = touchStartAlpha + deltaX * mouseRotationSpeed;
            beta = touchStartBeta - deltaY * mouseRotationSpeed;
            
            // Constrain beta to prevent over-rotation
            beta = Math.max(-Math.PI/2, Math.min(Math.PI/2, beta));
        }
    });

    graphcanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        
        if (e.touches.length === 0) {
            // All fingers lifted
            isPinching = false;
            isPanning = false;
            isRotating = false;
        } else if (e.touches.length === 1) {
            // One finger left - switch to rotation mode
            isPinching = false;
            isPanning = false;
            isRotating = true;
            
            const touch = e.touches[0];
            lastMouseX = touch.clientX;
            lastMouseY = touch.clientY;
            touchStartAlpha = alpha;
            touchStartBeta = beta;
        }
    });

    // Prevent context menu on long press
    graphcanvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Getter and setter functions for external access
function getHash() {
    return hash;
}

function setHash(newHash) {
    hash = newHash;
}

function getGraphState() {
    return { alpha, beta, ox, oy, zoom };
}

function setGraphState(newState) {
    if (newState.alpha !== undefined) alpha = newState.alpha;
    if (newState.beta !== undefined) beta = newState.beta;
    if (newState.ox !== undefined) ox = newState.ox;
    if (newState.oy !== undefined) oy = newState.oy;
    if (newState.zoom !== undefined) zoom = newState.zoom;
}

function get_closest_node_to(screen_coords, nodes) {
    var min_dist = 100000000;
    var best_node = "";
    
    // Debug: log the first few node keys to understand the structure
    let keyCount = 0;
    for (const name in nodes) {
        if (keyCount < 5) {
            console.log('Node key:', name, 'type:', typeof name, 'node:', nodes[name]);
            keyCount++;
        }
        const node = nodes[name];
        var d = Math.hypot(node.screen_x-screen_coords.x, node.screen_y-screen_coords.y);
        if (d < min_dist) {
            min_dist = d;
            best_node = name;
        }
    }
    console.log('Min distance:', min_dist, 'Best node:', best_node, 'type:', typeof best_node);
    if(min_dist > 30) return hash;
    return best_node;
}

// Export for ES6 modules
export { 
    renderGraph, 
    get_node_coordinates, 
    setupGraphEventListeners,
    getHash,
    setHash,
    getGraphState,
    setGraphState,
    get_closest_node_to,
    initializeGraphPosition
};
