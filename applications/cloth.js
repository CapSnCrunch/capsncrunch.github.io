let nodes = [];
let graph;

// only works with squares rn
let X = 20;
let Y = 20;

function setup() {
  var cnv = createCanvas(400, 400);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  
  for(let i = 0; i < Y; i++){
    for(let j = 0; j < X; j++){
      //nodes[3*i+j] = new Node(50+30*j, 50+30*i)
      append(nodes, new Node(50+(width-100)/(X-1)*j, 50+(width-100)/(X-1)*i))
    }
  }
  graph = new Graph(nodes);
}

function draw() {
  background(237, 251, 219);
  fill(50);
  ellipse(mouseX, mouseY, 3, 3);
  graph.display();
}

class Node {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  display(){
    fill(50);
    ellipse(this.x, this.y, 2, 2);
  }
}

class Graph {
  constructor(nodes){
    this.nodes = nodes;
    this.array = [];
    for(let x = 0; x < nodes.length; x++){
      let row = [];
      for(let y = 0; y < nodes.length; y++){
        append(row, 0);
      }
      append(this.array, row);
    }
    for(let i = 0; i < nodes.length; i++){
      let x = i % X;
      let y = floor(i / Y);
      if(x+1 != X){
        this.add_connection(i, (x+1) + y*Y)
      }
      this.add_connection(i, x + (y+1)*Y)
    }
  }

  add_connection(index1, index2){
    if(0 <= index2 && index2 < this.nodes.length){
      this.array[index1][index2] = 1;
      this.array[index2][index1] = 1;
    }
  }

  display(){
    for(let i = 0; i < this.nodes.length; i++){
      //this.nodes[i].display();
    }
    for(let i = 0; i < nodes.length; i++){
      for(let j = 0; j < i; j++){
        if(this.array[i][j] == 1){
          strokeWeight(0.5);
          line(this.nodes[i].x, this.nodes[i].y, this.nodes[j].x, this.nodes[j].y);
        }
      }
    }
  }
}