// 2D array A* pathfinder
// Abdul Raffey
// October 11, 2020
//
//Work Cite:
//https://en.wikipedia.org/wiki/A*_search_algorithm
//https://www.youtube.com/watch?v=aKYlikFAV4k
//https://www.slant.co/versus/11584/11585/~dijkstra-s-algorithm_vs_a-algorithm
//https://www.youtube.com/watch?v=GC-nBgi9r0U
//https://www.youtube.com/watch?v=EaZxUCWAjb0
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// **********************************************************************
//  A* educated guess to find the best path from point A to point B
//  A* formula is f(n) = g(n) + h(n)

const GRIDSIZE = 16;

let cellsToCheck;
let cellThatHaveBeenChecked;
let startingPoint;
let endingPoint;
let cellWidth, cellHeight;
let path;
let currentValue;
let isPathFound = false;

let endScreenDisplay;

let grid, levelPath;

let enemies = [];
let enemy;
let numberOfEnemies = 2;
let enemyX = 0;
let enemyY = 0;
let enemyHealth = 100;
let pathToFollow = [];

let canon;
let canonXCordinate, canonYCordinate, canonWidth, canonHeight;

let x, y, isDragging;

let score = 0;
let level = 1;

let numberOfguns = 1;
let player;
let hit = false;

let canonX;
let canonY;

let canonNumber;

function preload() {
  grid = loadStrings("assets/level1.txt");
  levelPath = loadStrings("assets/level1path.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  cellsToCheck = [];
  cellThatHaveBeenChecked = [];
  path = [];

  generateGrid();

  // startingPoint point
  startingPoint = grid[0][0];

  // endingPoint point
  endingPoint = grid[13][12];

  cellsToCheck.push(startingPoint);

  enemy = new Enemy (enemyX, enemyY, pathToFollow, cellHeight, cellWidth, enemyHealth);
  for (let i = 0; i < numberOfEnemies; i++) {
    enemies[i] = enemy;
  }

  canon = loadImage("canon.jpg");
  canonXCordinate = windowWidth - windowWidth/1.11;
  canonYCordinate = windowHeight - windowHeight/1.82;
  canonWidth = cellWidth*3;
  canonHeight = cellHeight*3;

  canonX = width/2;
  canonY = height-50;

  //player = new Character(canonX, canonY, mouseX, mouseY);

}

function draw() {

  background(0);
  //player = new Character(canonX, canonY, mouseX, mouseY);
  findPath();
  displayPath();
  makePathForEnemy();
  enemy.enemyAlive();
  
  if (enemy.isEnemyAlive) {
    enemy.display();
    enemy.healthBar();
  }
  displayLevel();
  displayScore();
  changeDisplay();
  //enemy.spawnCanons();
  enemy.attack();
  enemy.enemyUpdate();
  // enemy.nearBy();
  // enemy.keyPressed();
  // enemy.collisionCheck();
  // player.update();
  // player.display();
  // player.moveRectangle();

  
}

class Enemy {
  constructor(x, y, path, height, width, health, healthBarColor) {
    this.startX = x;
    this.startY = y;
    this.color = color(random (255), random (255), random (255));
    this.width = width;
    this.height = height;
    this.health = health;
    this.isEnemyAlive = true;

    this.x = x;
    this.y = y;
    this.pathLocation = 0;
    this.followPath = path;

    this.healthBarWidth = width;
    this.healthBarHeight = height / 3;

    this.enemyArray = [];
  }

  move() {
    if (isPathFound) {
      this.pathLocation += 1;
      levelPath[this.x][this.y] = 0;
      this.y = this.followPath[this.pathLocation].y;
      this.x = this.followPath[this.pathLocation].x;
      levelPath[this.x][this.y] = 2;
      console.log("have moved");
    }
  }

  display() {
    levelPath[this.x][this.y] = 2;

    for (let x = 0; x < GRIDSIZE; x++) {
      for (let y = 0; y < GRIDSIZE; y++) {
        if (levelPath[x][y] === 2) {
          fill("black");
          rect(this.x * this.width, this.y * this.height, this.width, this.height);
        }
      }
    }
  }

  healthBar() {
    noFill();
    // stroke();
    strokeWeight(2);
    rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth, this.healthBarHeight, 10, 10);

    noStroke();
    if (this.health <= 100 && this.health >= 60) {
      fill("green");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth, this.healthBarHeight, 10, 10);

    }
    else if (this.health < 90 && this.health >= 30) {

      fill("yellow");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - 20, this.healthBarHeight, 10, 10);
    }
    else if (this.health < 60 && this.health > 0) {
      fill("red");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - 40, this.healthBarHeight, 10, 10);
    }
  }

  enemyAlive() {
    if (this.health <= 0) {
      this.isEnemyAlive = false;
    }
  }

  enemyUpdate() {
    //player movement

    //bullet movement
    for (let i=0; i<this.enemyArray.length; i++) {
      this.enemyArray[i].update();
      this.enemyArray[i].display();
      if ((this.enemyArray[i].x + cellWidth /4 ) - (this.x * this.width) <= 1) {
        if ((this.enemyArray[i].y + cellWidth /4 ) - (this.y * this.height) <= 1) {
          this.enemyArray[i].spawnBullet();
          console.log(this.enemyArray[i].x + cellWidth /4 );
          console.log(this.x * this.height);
        }
      } 
    }
  }

  // nearBy() {
  //   if ((canonX ) - (this.x * this.width) <= 0) {
  //     // console.log("abdul dead");
  //   }
  // }

  spawnCanons() {
    this.enemyArray.push(new Character(canonX, canonY, cellWidth, cellHeight));
  }
  // collisionCheck(otherBall) {
  //   let distanceApart = dist(this.x, this.y, otherBall.x, otherBall.y);
  //   let sumOfRadii = this.radius + otherBall.radius;
  //   if (distanceApart <= sumOfRadii) {
  //     this.fillColor = "red";

  //     let tempDx = this.dx;
  //     let tempDy = this.dy;

  //     this.dx = otherBall.dx;
  //     this.dy = otherBall.dy;

  //     otherBall.dx = tempDx;
  //     otherBall.dy = tempDy;
  //   }
  // }
  
  attack() {
    //if (hit) {
    // console.log("yes it worked");
    //}
  }
}


function displayPath() {
// display grid
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].displayGrid(color(230,230,230));
      if (levelPath[x][y] === 3) {
        grid[x][y].displayGrid(color("red"));
      }
    }
  }

  // Make wall where need
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      if (levelPath[x][y] === 1) {
        grid[x][y].wall = true;
      }
    }
  }

}

function generateGrid() {
  cellWidth = width / GRIDSIZE;
  cellHeight = height / GRIDSIZE;

  // convert Level into 2D array
  for (let i = 0; i < grid.length; i++) {
    grid[i] = grid[i].split(",");
  }

  //loop through the whole 2D array, and turn everything to numbers
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y] = int(grid[x][y]);
    }
  }

  // convert Level Path into 2D array
  for (let i = 0; i < levelPath.length; i++) {
    levelPath[i] = levelPath[i].split(",");
  }

  //loop through the whole 2D array, and turn everything to numbers
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
      levelPath[y][x] = int(levelPath[y][x]);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y] = new Pathfinder (x, y);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].checkNeighbors(grid);
    }
  } 
}

function mouseClicked() {
  // get the cell where you are clicking
  let cellX = floor(mouseX / cellWidth);
  let cellY = floor(mouseY / cellHeight);

  enemy.health -= 10;
  console.log(enemy.health);

  enemy.move();
  canonX = cellX * cellWidth;
  canonY = cellY * cellHeight;
  canonNumber = cellX * cellWidth ;
  for (let i=0; i<numberOfguns; i++) {
    console.log(numberOfguns);
    enemy.spawnCanons();
  }
}

// display grid
function displayLevel() {
  // textAlign(CENTER);
  //textStyle(BOLDITALIC);
  fill("Blue");
  textSize(24);
  text("Level: " + level, width - 120, 25);
}

// display score
function displayScore() {
  // textAlign(CENTER);
  //textStyle(BOLDITALIC);
  fill("blue");
  textSize(24);
  text("Score: " + score, width - 121, 55);
}

function changeDisplay() {
  if (!enemy.isEnemyAlive && enemies.length === 0) {
    level += 1;
    score = numberOfEnemies * 100;
  }
}

// *********************************************************** PATHFINDER ***************************************************************
class Pathfinder {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighborsToCheck = [];
    this.previous = undefined;
    this.wall = false;
  }
  // create and color rects to use when display grid
  displayGrid(color) {
    rectMode(CORNER);
    strokeWeight(0);
    fill(color);
    if (this.wall) {
      fill(0, 255, 0);
    }
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth - 1, cellHeight - 1);
  }

  checkNeighbors(grid) {
    let x = this.x;
    let y = this. y;
    // Check neighbors
    if (x < GRIDSIZE - 1) {
      this.neighborsToCheck.push(grid[x + 1] [y]);
    }

    if (x > 0) {
      this.neighborsToCheck.push(grid[x - 1] [y]);
    }

    if (y < GRIDSIZE - 1) {
      this.neighborsToCheck.push(grid[x] [y + 1]);
    }
    
    if (y > 0) {
      this.neighborsToCheck.push(grid[x] [y - 1]);
    }
  }
}

function findPath () {

  if (isPathFound === false) {
    // keep searching for A path
    if (cellsToCheck.length > 0) { 
  
      let lowestValue = 0;
      for (let x = 0; x < cellsToCheck.length; x++) {
        if (cellsToCheck[x].f < cellsToCheck[lowestValue].f) {
          lowestValue = x;
        }
      }
      currentValue = cellsToCheck[lowestValue]; 
  
      if (currentValue === endingPoint) {
        endScreenDisplay = "Solution Found";
        console.log(endScreenDisplay);
        // enemy.setStartingLocation();
        isPathFound = true;
        console.log(isPathFound);
        console.log(path);
        //screenState = "endScreen";
      }
  
      // remove the value from the cellsToCheck and push it into the cellThatHaveBeenChecked
      removeFromArray(cellsToCheck, currentValue);
      cellThatHaveBeenChecked.push(currentValue);
  
      let neighborsToCheck = currentValue.neighborsToCheck;
      for (let x = 0; x < neighborsToCheck.length; x++) {
        let myNeighbours = neighborsToCheck[x];
  
        // Check to see that your neighbour is not a wall and has not already been checked
        if (!cellThatHaveBeenChecked.includes(myNeighbours) && !myNeighbours.wall) {
          let gValue = currentValue.g + 1;
  
          if (cellsToCheck.includes(myNeighbours)) {
            if (gValue < myNeighbours.g) {
              myNeighbours.g = gValue;
            }
          }
          else {
            myNeighbours.g = gValue;
            cellsToCheck.push(myNeighbours);
          }
          // make an educated guess for the fastest path
          myNeighbours.h = checkDistance(myNeighbours, endingPoint);
          myNeighbours.f = myNeighbours.g + myNeighbours.h;
          myNeighbours.previous = currentValue;
        }
      }
    }
  
    // No Solution
    else {
      endScreenDisplay = "No Solution Found";
      console.log(endScreenDisplay);
      isPathFound = true;
      //screenState = "endScreen";
    }
  }
}

// look through the array and remove a cells that we have already visted
function removeFromArray(array, value) {
  for (let x = array.length - 1; x >= 0; x--) {
    if (array[x] === value) {
      array.splice(x, 1);
    }
  }
}

// check the distance between the starting and ending points
function checkDistance(a , b) {
  let distance = abs(a.x - b.x) + abs(a.y - b.y);
  return distance;
}

function makePathForEnemy() {
  //find the path
  if (isPathFound) {
    path = [];
    let value = currentValue;
    while (value.previous) {
      path.push(value.previous);
      value = value.previous;
    }
  }

  while(path.length > 0) {
    pathToFollow.push(path.pop());

  }
}
// Bullet class demo





class Character {
  constructor(x, y, mouseX, mouseY) {
    this.x = x;
    this.y = y;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.size = 25;
    this.bulletArray = [];
  }

  display() {
    fill("black");
    rectMode(CENTER);
    text("", this.x, this.y, canonNumber);
    rect(this.x + cellWidth/2, this.y + cellHeight/2, this.mouseX, this.mouseY);
    fill(255, 255, 255, 100);
    // noFill();
    ellipseMode(CENTER);
    // ellipseMode(CORNER);
    ellipse(this.x + cellWidth/2, this.y + cellHeight/2, cellWidth*3);
    console.log(canonNumber);
  }

  update() {
    //player movement

    //bullet movement
    for (let i=0; i<this.bulletArray.length; i++) {
      this.bulletArray[i].moveDown();
      this.bulletArray[i].display();
    }
  }

  spawnBullet() {
    this.bulletArray.push(new Bullet(this.x + this.size/2, this.y));
    // console.log("you");
  }

}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dy = -5;
    this.dx = -5;
  }

  moveUp() {
    this.y += this.dy;
  }
  moveDown() {
    this.y -= this.dy;
  }
  moveRight() {
    this.y -= this.dx;
  }
  moveLeft() {
    this.y += this.dx;
  }

  display() {
    fill("red");
    noStroke();
    circle(this.x, this.y, 5);
    // console.log("bullet");
  }
}