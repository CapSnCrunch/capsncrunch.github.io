function det(matrix){
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
        let temp = matrix * rp1Interval(this.a % PI, this.b % PI)
        let x = temp[0];
        let y = temp[1];

        console.log('det is', det(matrix))
        if (det(matrix) < 0){
            console.log(nj.arctan(y, x))
            let temp2 = nj.arctan(y, x)
            let b = temp2.get(0) % PI;
            let a = temp2.get(1) % PI;
        } else {
            let a = temp2.get(0) % PI;
            let b = temp2.get(1) % PI;
        }

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
}