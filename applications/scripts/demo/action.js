let N = 300
let scale = 0.9
let matrix;
let buttonHover;
let intervals = []

let fontLight;
function preload(){
    fontLight = loadFont('Nunito-Regular.ttf')
}

function setup(){
    var cnv = createCanvas(1000 * scale, 600 * scale);
    cnv.parent('canvas');
    radius = width / 5; 
    for(let i = 0; i < N; i++){
        intervals.push(new Interval(i*PI/N, (i+1)*PI/N))
    }

    matrix = cB
}

function draw(){
    colorMode(HSB, 100)

    clear();
    fill(100)
    noStroke()
    rect(0, 0, width, height, 50)

    stroke(70)
    strokeWeight(1)
    ellipse(width/4, height/2 - 50, 2*radius, 2*radius)
    ellipse(width - width/4, height/2 - 50, 2*radius, 2*radius)

    for(let i = 0; i < N; i++){
        noStroke()
        fill(100*(i/N), 75, 90)
        arc(width/4, height/2 - 50, 2 * radius, 2 * radius, intervals[i].a * 2, intervals[i].b * 2)
        
        let image = intervals[i].getImage(matrix)
        arc(width - width/4, height/2 - 50, 2 * radius, 2 * radius, image.a * 2, image.b * 2)
    }

    fill(100)
    ellipse(width/4, height/2 - 50, 2*radius-30, 2*radius-30)
    ellipse(width - width/4, height/2 - 50, 2*radius-30, 2*radius-30)

    stroke(0)
    strokeWeight(2)
    line(width/2 - 20, height/2 - 50, width/2 + 20, height/2 - 50)
    line(width/2 + 10, height/2 - 50 - 10, width/2 + 20, height/2 - 50)
    line(width/2 + 10, height/2 - 50 + 10, width/2 + 20, height/2 - 50)

    fill(98)
    stroke(99)
    rect(width * 0.125, height - height * 0.2125, width * 0.175, width * 0.115, 5)
    rect(width * 0.325, height - height * 0.2125, width * 0.25, width * 0.115, 5)
    rect(width * 0.6, height - height * 0.2125, width * 0.325, width * 0.115, 5)

    stroke(85)
    fill(100 - 10 * (matrix == cA || buttonHover == 'cA'))
    rect(width * 0.15, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == cB || buttonHover == 'cB'))
    rect(width * 0.225, height - height * 0.17, width * 0.05, width * 0.05, 5)

    fill(100 - 10 * (matrix == tA || buttonHover == 'tA'))
    rect(width * 0.35, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == tB || buttonHover == 'tB'))
    rect(width * 0.425, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == tC || buttonHover == 'tC'))
    rect(width * 0.5, height - height * 0.17, width * 0.05, width * 0.05, 5)
    
    fill(100 - 10 * (matrix == sa || buttonHover == 'sa'))
    rect(width * 0.625, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == sb || buttonHover == 'sb'))
    rect(width * 0.7, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == sc || buttonHover == 'sc'))
    rect(width * 0.775, height - height * 0.17, width * 0.05, width * 0.05, 5)
    fill(100 - 10 * (matrix == sd || buttonHover == 'sd'))
    rect(width * 0.85, height - height * 0.17, width * 0.05, width * 0.05, 5)

    buttonHover = ''
    if (width * 0.15 < mouseX && mouseX < width * 0.2 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'cA'}
    if (width * 0.225 < mouseX && mouseX < width * 0.275 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'cB'}
    
    if (width * 0.35 < mouseX && mouseX < width * 0.4 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'tA'}
    if (width * 0.425 < mouseX && mouseX < width * 0.475 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'tB'}
    if (width * 0.5 < mouseX && mouseX < width * 0.55 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'tC'}
   
    if (width * 0.625 < mouseX && mouseX < width * 0.675 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'sa'}
    if (width * 0.7 < mouseX && mouseX < width * 0.75 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'sb'}
    if (width * 0.775 < mouseX && mouseX < width * 0.825 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'sc'}
    if (width * 0.85 < mouseX && mouseX < width * 0.9 && height - height * 0.17 < mouseY && mouseY < height - height * 0.079 + width * 0.05){buttonHover = 'sd'}

    fill(60)
    noStroke()
    textSize(16 - (1 - scale) * 15)
    textFont(fontLight)
    text('Cyclic', width * 0.192, height - height * 0.048)
    text('Triangle', width * 0.420, height - height * 0.048)
    text('Surface', width * 0.74, height - height * 0.048)

    fill(60)
    textSize(32 - (1 - scale) * 15)
    text('a', width * 0.167, height - height * 0.113)
    text('b', width * 0.240, height - height * 0.113)

    text('a', width * 0.365, height - height * 0.113)
    text('b', width * 0.44, height - height * 0.113)
    text('c', width * 0.515, height - height * 0.113)

    text('a', width * 0.64, height - height * 0.113)
    text('b', width * 0.715, height - height * 0.113)
    text('c', width * 0.79, height - height * 0.113)
    text('d', width * 0.865, height - height * 0.113)
}

function mousePressed(){
    if (buttonHover == 'cA'){matrix = cA}
    if (buttonHover == 'cB'){matrix = cB}
    if (buttonHover == 'tA'){matrix = tA}
    if (buttonHover == 'tB'){matrix = tB}
    if (buttonHover == 'tC'){matrix = tC}
    if (buttonHover == 'sa'){matrix = sa}
    if (buttonHover == 'sb'){matrix = sb}
    if (buttonHover == 'sc'){matrix = sc}
    if (buttonHover == 'sd'){matrix = sd}
}