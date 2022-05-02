function determinant(matrix){
    // Return the determinant of a matrix
    //  Note: currently this only accepts 2x2 NumJs matrices
    return matrix.get(0,0) * matrix.get(1,1) - matrix.get(0,1) * matrix.get(1,0)
}

function rp1ToS1(v){
    // Map a vector v in R^2 - {0} to S1 by the homeomorphism RP1 -> S1
    let x = v[0];
    let y = v[1];

    return nj.array([
        [2*x*y / (x*x + y*y)],
        [(x*x - y*y) / (x*x + y*y)]
    ])
}

function rp1Interval(theta1, theta2){
    // Get a pair of points in RP1 representing the pair of angles theta1, theta2
    //  Note: theta1, theta2 parametrize the double cover of RP1
    return nj.array([
        [cos(theta1), cos(theta2)],
        [sin(theta1), sin(theta2)]
    ])
}

function getArcParams(interval){
    // Map a pair of points in R^2 - {} to a pair of circle angles
    let x = interval.get(0)
    let y = interval.get(1)
    return 0
}

class Interval {
    constructor(a, b){
        this.a = a;
        this.b = b;
    }

    drawLine(intervalHeight, color, bold = false){
        // Draw the line version of the interval to the canvas at a specified height
        stroke(color[0], color[1], color[2])
        strokeWeight(7 + 4 * bold)
        let x1 = (width/2 - 100) * this.a / PI + width/2 + 50
        let x2 = (width/2 - 100) * this.b / PI + width/2 + 50
        if (x1 > x2){
            line(width/2 + 50, intervalHeight, x2, intervalHeight)
            line(x1, intervalHeight, width - 50, intervalHeight)
        } else {
            line(x1, intervalHeight, x2, intervalHeight)
        }
    }

    drawArc(center, radius, color, bold = false){
        // Draw the arc version of the interval to the canvas with a specified center and radius
        stroke(color[0], color[1], color[2])
        strokeWeight(7 + 5 * bold)
        arc(center[0], center[1], 2 * radius, 2 * radius, this.a * 2, this.b * 2)
    }

    getImage(matrix){
        // Get the image of the interval under an action in SL(2,R)
        //  Return the image as an Interval object
        let temp = matrix.dot(rp1Interval(this.a % PI, this.b % PI))
        console.log('temp', temp)
        console.log('matrix', matrix)
        console.log('interval', rp1Interval(this.a % PI, this.b % PI))

        let x1 = temp.get(0,0);
        let y1 = temp.get(0,1);
        let x2 = temp.get(1,0);
        let y2 = temp.get(1,1);

        let a, b;

        if (determinant(matrix) < 0){
            b = Math.atan2(y1, x1) % PI;
            a = Math.atan2(y2, x2) % PI;
        } else {
            a = Math.atan2(y1, x1) % PI;
            b = Math.atan2(y2, x2) % PI;
        }

        // JavaScript mod function ignores negative
        if (a < 0){a += PI}
        if (b < 0){b += PI}

        console.log('a', a, 'b', b)
        return new Interval(a, b, this.color)
    }
}

class DisconnectedInterval {
    constructor(components, color){
        this.components = components;
        this.color = color;
    }

    drawLine(intervalHeight, bold = false){
        // Draw the line version of the disconnected interval to the canvas at a specified height
        stroke(200)
        strokeWeight(1 + 2*bold)
        line(width/2 + 50, intervalHeight, width - 50, intervalHeight)
        for(let i = 0; i < this.components.length; i++){
            this.components[i].drawLine(intervalHeight, this.color, bold)
        }
    }

    drawArc(center, radius, bold = false){
        // Draw the line version of the disconnected interval to the canvas at a specified height
        for(let i = 0; i < this.components.length; i++){
            this.components[i].drawArc(center, radius, this.color, bold)
        }
    }

    drawImage(matri, intervalHeight, bold = false){
        // Draw the image of the disconnected interval under a matrix
        let images = []
        for(let i = 0; i < this.components.length; i++){
            images.push(this.components[i].getImage(graph[0][1]))
        }
        for(let i = 0; i < images.length; i++){
            images[i].drawLine(intervalHeight, bold)
        }
    }
}