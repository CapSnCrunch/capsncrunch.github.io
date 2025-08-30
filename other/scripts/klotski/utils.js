// Utility functions for Klotski puzzle visualization

// Helper function for normalized sine calculation
function normsin(angle) {
    return Math.floor(128.0 * (Math.sin(angle) + 1));
}

// Utility function for color wheel generation
function color_wheel(angle, brightness = 1) {
    angle *= 0.025;
    var r = normsin(angle) * brightness;
    var g = normsin(angle + Math.PI * 2.0 / 3) * brightness;
    var b = normsin(angle + Math.PI * 4.0 / 3) * brightness;
    return "rgb(" + r + "," + g + "," + b + ")";
}

// Export for ES6 modules
export { color_wheel, normsin };
