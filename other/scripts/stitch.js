class Button{
  constructor(type, num, on){
    this.type = type;
    this.num = num;
    this.on = on;
    this.radius = margin / 7;
  }
  
  display(){
    noStroke();
    if (this.on){
      fill(50, 200, 50);
    }
    else {
      fill(200, 50, 50);
    }
    if (this.type == 0){
      ellipse(margin/2, margin + this.num*(height-margin*2)/N, this.radius, this.radius);
    }
    else {
      ellipse(margin + this.num*(width-margin*2)/N, margin/2, this.radius, this.radius);
    }
    stroke(50);
    strokeWeight(1.2);
    for(let i = 0; i < N; i++){
      let x1, y1, x2, y2;
      if (this.type == 0){
        x1 = margin + i*(width-margin*2)/N;
        y1 = margin + this.num*(height-margin*2)/N;
        x2 = margin + (i+1)*(width-margin*2)/N;
        y2 = margin + this.num*(height-margin*2)/N;
      }
      else {
        x1 = margin + this.num*(width-margin*2)/N;
        y1 = margin + i*(height-margin*2)/N;
        x2 = margin + this.num*(width-margin*2)/N;
        y2 = margin + (i+1)*(height-margin*2)/N;
      }
      if ((this.on && i % 2 == 0) || (!this.on && i % 2 == 1)){
        line(x1, y1, x2, y2);
      }
    }
  }

  check_pressed(){
    let x, y;
    if (this.type == 0){
      x = margin/2;
      y = margin + this.num*(height-margin*2)/N;
    }
    else {
      x = margin + this.num*(width-margin*2)/N;
      y = margin/2;
    }
    if (pow(mouseX - x, 2) + pow(mouseY - y, 2) < pow(this.radius, 2)){
      this.on = !this.on;
    }
  }

}

let N = 20; // Size of grid
let margin = 50; // Size of margin
let row_buttons = [];
let col_buttons = [];

function setup(){
  var cnv = createCanvas(450, 450);
  cnv.parent('canvas');

  //var x = (windowWidth - width) / 2;
  //var y = (windowHeight - height) / 2;
  
  //cnv.position(x, y);
  //cnv.parent('canvas');

  for(let i = 0; i < N; i++){
    append(row_buttons, new Button(0, i, random(1) > 0.5));
    append(col_buttons, new Button(1, i, random(1) > 0.5));
  }
  ellipseMode(RADIUS);
}

function draw(){
  clear();
  for(let i = 0; i < N; i++){
    row_buttons[i].display();
    col_buttons[i].display();
  }
}

function mouseReleased(){
  for(let i = 0; i < N; i++){
    row_buttons[i].check_pressed();
    col_buttons[i].check_pressed();
  }
}

function windowResized() {
  var cnv = createCanvas(450, 450);
  cnv.parent('canvas');
}

function update(){
  var div = document.getElementById('mycanvas');
}
