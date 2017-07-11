

// create field
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 80;
const ctx = canvas.getContext('2d');
canvas.style.margin = '-8px -8px -12px';
canvas.style.backgroundColor = 'grey';
canvas.style.border = 'solid 10px lightgrey';
document.body.appendChild(canvas);

let startPop = document.querySelector('.startPop');
let base     = document.querySelector('.overlay');
let lostPop  = document.querySelector('.lostPop');
let newbie   = document.querySelector('.Newbie');
let expert   = document.querySelector('.Expert');
let master   = document.querySelector('.Master');
let alien    = document.querySelector('.Alien');
let submit   = document.querySelector('.submit');

let snake = [{'x':100, 'y':100}];
let dirX = 0;
let dirY = 0;
let step = 20;
let [fx, fy] = Food();
let eatSound = new Audio('eat.wav');
let lostSound = new Audio('lost.wav');
let intervalId;
let interval;

function showSnake(){
	for (let i = 0; i < snake.length; i++) {
		ctx.beginPath();
		ctx.rect(snake[i]['x'], snake[i]['y'], 20, 20);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.strokeStyle = 'grey';
		ctx.stroke();
	}
}

function Food() {
	let fx = Math.floor(Math.random() * (canvas.width - 20) / 20) * 20;
	let fy = Math.floor(Math.random() * (canvas.height - 20) /20) * 20;
	// preventing food shows on snake
	for (let i = 0; i < snake.length; i++) {
		if (snake[i] == {x: fx, y: fy}) {
			Food()
		}
	}
	return [fx, fy];
}

function showFood(){
	ctx.beginPath();
	ctx.rect(fx, fy, 20, 20);
	ctx.fillStyle = "salmon";
	ctx.fill();
}


let lastKey;
function changeDirection(e) {
	lastKey = e;
}

function f(e) {
	//press the arrow key to start the game
	if (dirX == 0 && dirY == 0) {
		if (e.keyCode == 37) {//left
			dirX = -1;
			dirY = 0;
		}
		if (e.keyCode == 38) { //up
			dirY = -1;
			dirX = 0;
		}
		if (e.keyCode == 39) { //right
			dirX = 1;
			dirY = 0;
		}	
		if (e.keyCode == 40) { //down
			dirY = 1;
			dirX = 0;
		}
	}

	// snake is moving up / down
	if (dirX == 0 && dirY == -1 || dirX == 0 && dirY == 1) {
		if (e.keyCode == 37) { //left
			dirX = -1;
			dirY = 0;
		}
		if (e.keyCode == 39) { //right
			dirX = 1;
			dirY = 0;
		}
	}

	// snake is moving left / right
	if (dirX == -1 && dirY == 0 || dirX == 1 && dirY == 0) {
		if (e.keyCode == 38) { //up
			dirY = -1;
			dirX = 0;
		}
		if (e.keyCode == 40) { //down
			dirY = 1;
			dirX = 0;
		}	
	}
}
document.onkeydown = changeDirection;


function eat() {
	if (snake[snake.length - 1]['x'] == fx && snake[snake.length - 1]['y'] == fy) {
		snake.push({x: fx + step * dirX, y: fy + step * dirY});
		[fx, fy] = Food();
		eatSound.play();
	}
}

// if snake hit itself, you lose!
function hitSelf() {
	let tmp = snake[snake.length - 1];
	for (i = 0; i < snake.length - 1; i++){
		if (snake[i]['x'] == tmp['x'] && snake[i]['y'] == tmp['y']){
			console.log('bingo');
			clearInterval(intervalId);
			lostPopup();
			document.onkeydown = enterControl; //press enter to restart the game
		}
	}
}


// move, FIFO. if the snake head touches the border, you lose!
function move(){
	let n = snake.length;
	let tmpX = snake[n - 1]['x'] + step * dirX;
	let tmpY = snake[n - 1]['y'] + step * dirY;
	snake.push({'x': tmpX, 'y': tmpY})
	snake.shift();
	snake.innerHTML = '1';

	if (snake[n - 1]['x'] < 0 || snake[n - 1]['x'] > canvas.width || snake[n - 1]['y'] < 0 || snake[n - 1]['y'] > canvas.height) {
		lostSound.play();	
		clearInterval(intervalId);		
		lostPopup();
		document.onkeydown = enterControl; //press enter to restart the game
	}
	
} 


// this popup shows before the game. you can also choose the difficulty.
function startPopup() {
	startPop.style.display = 'block';
	base.style.display = 'block';
	// document.onkeydown = oneControl;
}
startPopup();

function newbieStart(){
	interval = 100;
	startGame()
	
}

function expertStart(){
	interval = 60;
	startGame();
}

function masterStart(){
	interval = 40;
	startGame();
}

function alienStart(){
	interval = 20;
	startGame();
}


function startGame(){
	startPop.style.display = 'none';
	base.style.display = 'none';
	intervalId = setInterval(run, interval);
	snake = [{'x':100, 'y':100}];
	dirX = 0;
	dirY = 0;
}


// this popup shows up when a game is over.
function lostPopup() {
	lostPop.style.display = 'block';
	base.style.display = 'block';
}

function reStart(){
	lostPop.style.display = 'none';
	base.style.display = 'none';
	startPop.style.display = 'block';
	base.style.display = 'block';
	document.onkeydown = changeDirection;
}


function enterControl(e){
	if (e.keyCode == 13){
		reStart()
	}
}


function score() {
	let n = snake.length;
	let points = 0;
	points = (n - 1) * 5
	document.querySelector(".scoreBoard").innerHTML = points;
}


function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// startGame();
function run() {
	if (lastKey != undefined) {
		f(lastKey);
		lastKey = undefined;
	}
	
	clear();
	move();
	showSnake();
	showFood();
	eat();
	hitSelf();
	score();
}



