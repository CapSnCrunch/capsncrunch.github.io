let fontLight;
function preload(){
    fontLight = loadFont('Nunito-Regular.ttf')
}

let scale = 0.9
function setup(){
    var cnv = createCanvas(1000 * scale, 600 * scale);
    cnv.parent('canvas');
    radius = width / 5; 
}

let pressing = false
let selected = -1
let radius = 200; // Radius of circle graph sits on
let buttonHover = ''
let intervalView = 'line'

// Get the current group along with its associated automatic structure and valid intervals
//  Set the color of each disconnected interval
let graph = cyclicGraph
let intervals = cyclicIntervals

function drawEdge(theta1, theta2, color = 200){
    // Link for calculating the hyperbolic arc between two angles
    // https://mathworld.wolfram.com/PoincareHyperbolicDisk.html

    noFill()
    if (color != 200){
        strokeWeight(3)
        stroke(color[0], color[1], color[2])
    } else {        
        strokeWeight(1)
        stroke(200)
    }

    // Check if a node connects to itself
    if (theta1 == theta2 || (theta1 == 0 && theta2 == 0)){
        ellipse(width/4 + (radius + 15) * cos(theta1), width/4 + (radius + 15) * sin(theta1), 25, 25)
        return
    }

    // Check if a node is exactly halfway across the circle
    //  (In this case the hyperbolic drawing will fail so we need to do it manually)
    let eps = 0.001
    if (PI - eps < abs(theta2 - theta1) && abs(theta2 - theta1) < PI + eps){
        let x1 = width/4 + radius * cos(theta1)
        let y1 = width/4 + radius * sin(theta1)
        let x2 = width/4 + radius * cos(theta2)
        let y2 = width/4 + radius * sin(theta2)
        line(x1, y1, x2, y2)
        if (color != 200){
            line(width/4, width/4, width/4 + 10 * cos(theta1 - PI/4), width/4 + 10 * sin(theta1 - PI/4))
            line(width/4, width/4, width/4 + 10 * cos(theta1 + PI/4), width/4 + 10 * sin(theta1 + PI/4))
        }
        return
    }

    let theta = (theta1 + theta2) / 2
    let dtheta = abs(theta1 - theta2) / 2
    let r = radius * tan(dtheta)
    let R = radius / cos(dtheta)
    let centerX = width/4 + R * cos(theta)
    let centerY = width/4 + R * sin(theta)
    let phi = asin(cos(dtheta))
    let gamma;

    if (phi > 0){
        gamma = PI/2 + max(theta1, theta2)
        arc(centerX, centerY, 2*r, 2*r, gamma, gamma + 2*phi)
    } else {
        gamma = PI/2 + min(theta1, theta2)
        arc(centerX, centerY, 2*r, 2*r, gamma, gamma - 2*phi)
    }

    // Draw an arrow to indicate edge direction
    if (color != 200){
        // Get the clockwise angle between theta1 and theta2
        //  This will be used to determine which direction to draw the arrow
        //  (They should all point outward from whatever point is highlighted)
        dot = cos(theta1) * cos(theta2) + sin(theta1) * sin(theta2)
        det = cos(theta1) * sin(theta2) - sin(theta1) * cos(theta2)
        angle = Math.atan2(det, dot)

        if (phi > 0){
            let arrowX = centerX + r * cos(gamma + phi)
            let arrowY = centerY + r * sin(gamma + phi)
            if (angle > 0){
                line(arrowX, arrowY, arrowX + 10 * cos(gamma + phi + PI/2 - PI/4), arrowY + 10 * sin(gamma + phi + PI/2 - PI/4))
                line(arrowX, arrowY, arrowX + 10 * cos(gamma + phi + PI/2 + PI/4), arrowY + 10 * sin(gamma + phi + PI/2 + PI/4))
            } else {
                line(arrowX, arrowY, arrowX + 10 * cos(gamma + phi + PI/2 - 3*PI/4), arrowY + 10 * sin(gamma + phi + PI/2 - 3*PI/4))
                line(arrowX, arrowY, arrowX + 10 * cos(gamma + phi + PI/2 + 3*PI/4), arrowY + 10 * sin(gamma + phi + PI/2 + 3*PI/4))
            }
        } else {
            let arrowX = centerX - r * cos(gamma - phi)
            let arrowY = centerY - r * sin(gamma - phi)
            if (angle > 0){
                line(arrowX, arrowY, arrowX + 10 * cos(gamma - phi + PI/2 - PI/4), arrowY + 10 * sin(gamma - phi + PI/2 - PI/4))
                line(arrowX, arrowY, arrowX + 10 * cos(gamma - phi + PI/2 + PI/4), arrowY + 10 * sin(gamma - phi + PI/2 + PI/4))    
            } else {
                line(arrowX, arrowY, arrowX + 10 * cos(gamma - phi + PI/2 - 3*PI/4), arrowY + 10 * sin(gamma - phi + PI/2 - 3*PI/4))
                line(arrowX, arrowY, arrowX + 10 * cos(gamma - phi + PI/2 + 3*PI/4), arrowY + 10 * sin(gamma - phi + PI/2 + 3*PI/4))    
            }
        }
    }
}

function draw(){
    clear();
    fill(255)
    noStroke()
    rect(0, 0, width, height, 50)

    // Draw the edges of graph
    for(let i = 0; i < Object.keys(graph).length; i++){
        for(let j = 0; j < Object.keys(graph[i]).length; j++){
            let theta1 = TWO_PI * i / intervals.length;
            let theta2 = TWO_PI * Object.keys(graph[i])[j] / intervals.length;

            let ellipse1X = width/4 + radius * cos(theta1);
            let ellipse1Y = width/4 + radius * sin(theta1);
            if (pow(mouseX - ellipse1X, 2) + pow(mouseY - ellipse1Y, 2) < 100){
                selected = i
            }

            drawEdge(theta1, theta2)
        }
    }

    // Draw the highlighted edges of the graph
    if (selected != -1){
        // Draw the highlighted edges of the graph
        for(let j = 0; j < Object.keys(graph[selected]).length; j++){
            let theta1 = TWO_PI * selected / intervals.length;
            let theta2 = TWO_PI * Object.keys(graph[selected])[j] / intervals.length;
            drawEdge(theta1, theta2, intervals[selected].color)
            
            // Write the letter next to highlighted edges
            fill(intervals[selected].color)
            strokeWeight(1)
            textSize(20 - (1 - scale) * 15)
            textFont(fontLight)
            if (graph == cyclicGraph){
                if (graph[selected][Object.keys(graph[selected])[j]] === cA){
                    text('a', width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] === cB){
                    text('b', width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * sin(theta2))
                }
            } else if (graph == triangleGraph){
                if (graph[selected][Object.keys(graph[selected])[j]] == tA){
                    text('a', width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == tB){
                    text('b', width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == tC){
                    text('c', width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/2 < theta2 && theta2 < 3*PI/2)) * sin(theta2))
                }
            } else if (graph == surfaceGraph){
                if (graph[selected][Object.keys(graph[selected])[j]] == sa){
                    text('a', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sb){
                    text('b', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sc){
                    text('c', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sd){
                    text('d', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sA){
                    text('A', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sB){
                    text('B', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sC){
                    text('C', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                } else if (graph[selected][Object.keys(graph[selected])[j]] == sD){
                    text('D', width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * cos(theta2), width/4 + (radius + 20 + 10*(PI/3 < theta2 && theta2 < 3*PI/2) + 20*(theta2 < TWO_PI * 8 / intervals.length)) * sin(theta2))
                }
            }
        }
    }

    // Draw the nodes of the graph
    selected = -1
    for(let i = 0; i < intervals.length; i++){
        let theta = TWO_PI * i / intervals.length;
        let ellipseX = width/4 + radius * cos(theta);
        let ellipseY = width/4 + radius * sin(theta);
        
        fill(255)
        strokeWeight(2)
        stroke(colors[i][0], colors[i][1], colors[i][2])
        if (i == selected || pow(mouseX - ellipseX, 2) + pow(mouseY - ellipseY, 2) < 100){
            fill(colors[i][0], colors[i][1], colors[i][2])
            selected = i
        }
        ellipse(ellipseX, ellipseY, 25 - (1 - scale) * 15, 25 - (1 - scale) * 15);
    }

    // Draw the intervals depending on view
    if (intervalView == 'line'){
        // Draw intervals (line version)
        for(let i = 0; i < intervals.length; i++){
            let intervalHeight = height * 0.091 + i * (height - height * 0.35) / (intervals.length - 1);
            intervals[i].drawLine(intervalHeight, selected == i)
        }
        if (selected != -1){
            // Draw the images that the selected node contains
            for(let j = 0; j < Object.keys(graph[selected]).length; j++){
                let imageHeight = height * 0.091 + selected * (height - height * 0.35) / (intervals.length - 1);
                intervals[Object.keys(graph[selected])[j]].drawLineImage(graph[selected][Object.keys(graph[selected])[j]], imageHeight)
            }

            // Draw arrows from intervals to their images in the selected interval
            for(let j = 0; j < Object.keys(graph[selected]).length; j++){
                let intervalHeight = height * 0.091 + Object.keys(graph[selected])[j] * (height - height * 0.35) / (intervals.length - 1);
                let interval = intervals[Object.keys(graph[selected])[j]]
                let intervalX1, intervalX2;
                if (interval.components[0].a < interval.components[0].b){
                    intervalX1 = (width/2 - 100) * interval.components[0].a / PI + width/2 + 50
                    intervalX2 = (width/2 - 100) * interval.components[0].b / PI + width/2 + 50
                } else {
                    intervalX1 = width/2 + 50
                    intervalX2 = (width/2 - 100) * interval.components[0].b / PI + width/2 + 50
                }

                let intervalCenter = (intervalX1 + intervalX2)/2

                let imageHeight = height * 0.091 + selected * (height - height * 0.35) / (intervals.length - 1);
                let image = intervals[Object.keys(graph[selected])[j]].components[0].getImage(graph[selected][Object.keys(graph[selected])[j]])
                
                let imageX1, imageX2;
                if (image.a < image.b){
                    imageX1 = (width/2 - 100) * image.a / PI + width/2 + 50
                    imageX2 = (width/2 - 100) * image.b / PI + width/2 + 50
                } else {
                    imageX1 = width/2 + 50
                    imageX2 = (width/2 - 100) * image.b / PI + width/2 + 50
                }
                let imageCenter = (imageX1 + imageX2)/2
                
                stroke(0)
                strokeWeight(2)
                line(intervalCenter, intervalHeight, imageCenter, imageHeight)

                let x = (imageCenter - intervalCenter)
                let y = (imageHeight - intervalHeight)
                let angle = Math.atan2(y, x)

                line(imageCenter, imageHeight, imageCenter + 5 * cos(angle + 3*PI/4), imageHeight + 5 * sin(angle + 3*PI/4))
                line(imageCenter, imageHeight, imageCenter + 5 * cos(angle - 3*PI/4), imageHeight + 5 * sin(angle - 3*PI/4))

                // ellipse(imageCenter, imageHeight, 3, 3)
                // console.log(intervalCenter, intervalHeight, imageCenter, imageHeight)
            }
        }
    } else {
        // Draw intervals (arc version)
        noFill()
        stroke(200)
        strokeWeight(1)
        ellipse(width - width/4, width/4, 2 * radius, 2 * radius)
        for(let i = 0; i < intervals.length; i++){
            if (selected == - 1 || selected == i){
                intervals[i].drawArc([width - width/4, width/4], radius, selected == i)
            }
        }
        if (selected != -1){
            // Draw the images that the selected node contains
            for(let j = 0; j < Object.keys(graph[selected]).length; j++){
                intervals[Object.keys(graph[selected])[j]].drawArcImage(graph[selected][Object.keys(graph[selected])[j]], [width - width/4, width/4], radius)
            }
        }
    }

    // Check for button hovers
    buttonHover = ''
    if (width * 0.110 < mouseX && mouseX < width * 0.190 && height - height * 0.136 < mouseY && mouseY < height - height * 0.045){buttonHover = 'cyclic'}
    if (width * 0.210 < mouseX && mouseX < width * 0.290 && height - height * 0.136 < mouseY && mouseY < height - height * 0.045){buttonHover = 'triangle'}
    if (width * 0.310 < mouseX && mouseX < width * 0.390 && height - height * 0.136 < mouseY && mouseY < height - height * 0.045){buttonHover = 'surface'}
    if (width/2 + width * 0.100 < mouseX && mouseX < width/2 + width * 0.230 && height - 75 < mouseY && mouseY < height - height * 0.045){buttonHover = 'line'}
    if (width/2 + width * 0.280 < mouseX && mouseX < width/2 + width * 0.360 && height - 75 < mouseY && mouseY < height - height * 0.045){buttonHover = 'circle'}

    // Draw the buttons for switching the graph
    strokeWeight(2)
    stroke(230)

    fill(255 - 25 * (buttonHover == 'cyclic' || graph == cyclicGraph))
    rect(width * 0.110, height - height * 0.137, width * 0.080, height * 0.091, 5)

    fill(255 - 25 * (buttonHover == 'triangle' || graph == triangleGraph))
    rect(width * 0.210, height - height * 0.137, width * 0.080, height * 0.091, 5)

    fill(255 - 25 * (buttonHover == 'surface' || graph == surfaceGraph))
    rect(width * 0.310, height - height * 0.137, width * 0.080, height * 0.091, 5)

    fill(150)
    noStroke()
    textSize(16 - (1 - scale) * 15)
    textFont(fontLight)
    text('Cyclic', width * 0.129, height - height * 0.082)
    text('Triangle', width * 0.220, height - height * 0.082)
    text('Surface', width * 0.323, height - height * 0.082)

    // Draw the buttons for switching the interval view
    stroke(230)
    strokeWeight(2)

    fill(255 - 25 * (buttonHover == 'line' || intervalView == 'line'))
    rect(width/2 + width * 0.100, height - height * 0.137, width * 0.130, height * 0.091, 5)

    fill(255 - 25 * (buttonHover == 'circle' || intervalView == 'circle'))
    rect(width/2 + width * 0.280, height - height * 0.137, width * 0.130, height * 0.091, 5)

    stroke(150)
    strokeWeight(1)
    line(width/2 + width * 0.140, height - height * 0.109, width/2 + width * 0.190, height - height * 0.109)
    line(width/2 + width * 0.140, height - height * 0.091, width/2 + width * 0.190, height - height * 0.091)
    line(width/2 + width * 0.140, height - height * 0.073, width/2 + width * 0.190, height - height * 0.073)

    strokeWeight(5)
    stroke(254, 139, 98)
    line(width/2 + width * 0.145, height - height * 0.109, width/2 + width * 0.160, height - height * 0.109)
    line(width/2 + width * 0.170, height - height * 0.109, width/2 + width * 0.185, height - height * 0.109)
    stroke(246, 140, 150)
    line(width/2 + width * 0.155, height - height * 0.091, width/2 + width * 0.175, height - height * 0.091)
    stroke(235, 142, 200)
    line(width/2 + width * 0.150, height - height * 0.073, width/2 + width * 0.160, height - height * 0.073)
    line(width/2 + width * 0.175, height - height * 0.073, width/2 + width * 0.180, height - height * 0.073)

    noFill()
    stroke(150)
    strokeWeight(1)
    ellipse(width/2 + width * 0.345, height - height * 0.091, 25 - (1 - scale) * 15, 25 - (1 - scale) * 15)

    strokeWeight(4)
    stroke(235, 142, 200)
    arc(width/2 + width * 0.345, height - height * 0.091, 25 - (1 - scale) * 15, 25 - (1 - scale) * 15, 0, PI/4)
    stroke(246, 140, 150)
    arc(width/2 + width * 0.345, height - height * 0.091, 25 - (1 - scale) * 15, 25 - (1 - scale) * 15, PI/2, PI + PI/4)
    stroke(235, 142, 200)
    arc(width/2 + width * 0.345, height - height * 0.091, 25 - (1 - scale) * 15, 25 - (1 - scale) * 15, 3*PI/2, 3*PI/2 + PI/4)
    
}

function mousePressed(){
    // for(let i = 0; i < N; i++){
    //     let theta = TWO_PI * i / N;
    //     let ellipseX = 250 + radius * cos(theta);
    //     let ellipseY = 250 + radius * sin(theta);

    //     if (pow(mouseX - ellipseX, 2) + pow(mouseY - ellipseY, 2) < 100){
    //         selected = i
    //         break
    //     } else {
    //         selected = -1
    //     }
    // }

    // Buttons for switching 
    if (buttonHover == 'cyclic'){
        graph = cyclicGraph
        intervals = cyclicIntervals
    }
    if (buttonHover == 'triangle'){
        graph = triangleGraph
        intervals = triangleIntervals
    }
    if (buttonHover == 'surface'){
        graph = surfaceGraph
        intervals = surfaceIntervals
    }

    // Buttons for switching interval view
    if (buttonHover == 'line'){
        intervalView = 'line'
    }
    if (buttonHover == 'circle'){
        intervalView = 'circle'
    }
    
}

function mouseReleased(){
    pressing = false
}