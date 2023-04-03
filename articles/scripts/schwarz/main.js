// let fontLight;
// function preload(){
//     fontLight = loadFont('Nunito-Regular.ttf')
// }

let scale = 1
function setup(){
    var cnv = createCanvas(500 * scale, 500 * scale);
    cnv.parent('canvas');
}

let pressing = false

function draw(){
    clear();
    fill(255)
    noStroke()
    rect(0, 0, width, height, 50)

    stroke(230)
    line(0, height / 2, width, height / 2)
    line(width / 2, 0, width / 2, height)

    stroke(150)
    strokeWeight(2)

    let a = 200
    let b = 100
    let prevCoord = ellipseFunc(a, b, 0)
    for (let i = 0; i <= 1.1; i += 0.01){
        let ellipseCoord = ellipseFunc(a, b, i)
        line(prevCoord[0] + width / 2, prevCoord[1] + height / 2, ellipseCoord[0] + width / 2, ellipseCoord[1] + height / 2)
        prevCoord = ellipseCoord
    }

    let z = nj.C(mouseX - width / 2, mouseY - height / 2)
    let zstar = nj.CONJ(schwarzEllipse(a, b, z))
    
    // console.log(schwarzEllipse(a, b, z))

    noStroke()
    fill(200, 0, 0)
    ellipse(zstar.re + width / 2, zstar.im + height / 2, 15, 15)

    fill(0, 200, 0)
    ellipse(mouseX, mouseY, 15, 15)

}

function ellipseFunc(a, b, t){
    return [a * Math.cos(2*Math.PI*t), b * Math.sin(2*Math.PI*t)]
}

function schwarzEllipse(a, b, z){
    let term1 = nj.MUL(((a*a) + (b*b)) / ((a*a) - (b*b)), z)
    let radical = nj.ADD(nj.POW(z, 2), (b*b) - (a*a))
    console.log(radical, nj.POW(radical, 1/2))
    let term2 = nj.MUL((2*a*b) / ((b*b) - (a*a)), nj.POW(radical, 1/2))
    return nj.ADD(term1, term2)
}