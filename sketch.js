function setup() {
  var cnv = createCanvas(300, 300);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function draw() {
  background(21, 121, 91);
  fill(50);
  ellipse(mouseX, mouseY, 5, 5);
}