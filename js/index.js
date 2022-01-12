///////////////////////////////////////////////////////////////////////////////////
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries
	
	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
	import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
	import { getDatabase, set, ref, push, child, get} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

	
	const firebaseConfig = {
	apiKey: "AIzaSyBUvKHCJKAjQdywhtKHM2bL9MAj7f6rOXw",
	authDomain: "ferrois-project.firebaseapp.com",
	databaseURL: "https://ferrois-project-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "ferrois-project",
	storageBucket: "ferrois-project.appspot.com",
	messagingSenderId: "238913088786",
	appId: "1:238913088786:web:3667527b33fc457d2997cb",
	measurementId: "G-N6ZV5Y740J"
	};
	
	// Initialize Firebase
	const firebase = initializeApp(firebaseConfig);
	const analytics = getAnalytics(firebase);
	const database = getDatabase(firebase);
	

var canvas = document.querySelector(".canvas");
var ctx = canvas.getContext("2d");

canvas.width = 0.7 * innerWidth;
canvas.height = 1.2 * innerWidth;





const joystick_big = document.querySelector(".joystickBig");
const joystick_small = document.querySelector(".joystickSmall");

isJoystickActivated = false;
//function joystickActivated(){
//	alert("test")
//}

var joystickPos = {
	x : 0,
	y : 0
};

var joystickOffset = joystick_big.getBoundingClientRect();
var originalJoystickPos = {
	x :joystickOffset.width/2 - joystick_small.getBoundingClientRect().width/2 + joystickOffset.left,
	y :joystickOffset.height/2 - joystick_small.getBoundingClientRect().height/2 + joystickOffset.top
};

	var trueJoystickPos = {
		x :  originalJoystickPos.x + joystickPos.x,
		y :  originalJoystickPos.y + joystickPos.y
	};

function distChecker(){
	var distJoystick = Math.sqrt(Math.pow((clientMouseX - originalJoystickPos.x),2) + Math.pow((clientMouseY - originalJoystickPos.y),2));
}

function refreshPage(){
	ctx.rect(0,0,canvas.width,canvas.height)
	ctx.fillStyle = "rgba(55,55,55,1)";
	ctx.fill()
}

//Page Ticker
function ticker(){
	requestAnimationFrame(ticker);
	refreshPage()
	//Joystick Controls
	trueJoystickPos.x = originalJoystickPos.x + joystickPos.x,
	trueJoystickPos.y = originalJoystickPos.y + joystickPos.y
	joystick_small.style.top = trueJoystickPos.y+"px";
	joystick_small.style.left = trueJoystickPos.x+"px";
	try{
		mainPlayer.updateJoystick();
	}catch(err){
	}
	//Paddle Controls
	try{
		mainPaddle.control();
	}catch(err){
	}
	//Ball control
	try{
		ball.update();
	}catch(err){
	}
};
ticker();

window.ontouchstart = e => {
	var distJoystick = Math.hypot((e.touches[0].clientX - (originalJoystickPos.x + joystick_small.getBoundingClientRect().width/2)),(e.touches[0].clientY - (originalJoystickPos.y + joystick_small.getBoundingClientRect().height/2)))
	if (distJoystick < joystickOffset.width/2){
		isJoystickActivated = true;
		joystickPos.x = e.touches[0].clientX - ( joystickOffset.left + joystickOffset.width/2 );//- joystick_small.getBoundingClientRect().width);
		joystickPos.y = e.touches[0].clientY - ( joystickOffset.top + joystickOffset.height/2 );
	}
}

window.ontouchmove = e => {
//	joystickPos.x = e.touches[0].clientX - ( joystickOffset.left + joystickOffset.width/2 );//- joystick_small.getBoundingClientRect().width);
//	joystickPos.y = e.touches[0].clientY - ( joystickOffset.top + joystickOffset.height/2 );
	if (isJoystickActivated == true){
		var distJoystick = Math.hypot((e.touches[0].clientX - (originalJoystickPos.x + joystick_small.getBoundingClientRect().width/2)),(e.touches[0].clientY - (originalJoystickPos.y + joystick_small.getBoundingClientRect().height/2)));
		if (distJoystick < joystickOffset.width/2){
		joystickPos.x = e.touches[0].clientX - ( joystickOffset.left + joystickOffset.width/2 );//- joystick_small.getBoundingClientRect().width);
		joystickPos.y = e.touches[0].clientY - ( joystickOffset.top + joystickOffset.height/2 );
		}else{
			let ratioDist = distJoystick / (joystickOffset.width/2);
			joystickPos.x = (e.touches[0].clientX - ( joystickOffset.left + joystickOffset.width/2 ))/ratioDist;
			joystickPos.y = (e.touches[0].clientY - ( joystickOffset.top + joystickOffset.height/2 ))/ratioDist;
	
		}
		//console.log(distJoystick)
	}
}
window.ontouchend = e =>{
	isJoystickActivated = false;
	joystickPos = {
		x : 0,
		y : 0
	}
}



var gridsInX = 140;
var gridsInY = gridsInX * (canvas.height/canvas.width); //240
var _grid = canvas.width / gridsInX;

class Paddle{
	constructor(x1,x2,y1,y2,color,speed){
		this.x1 = x1 * _grid;
		this.x2 = x2 * _grid;
		this.y1 = y1 * _grid;
		this.y2 = y2 * _grid;
		this.color = color;
		this.paddleSpeed = speed;
	}
	draw(){
		ctx.beginPath();
		ctx.rect(this.x1,this.y1,this.x2-this.x1,this.y2-this.y1);
		ctx.fillStyle = this.color;
		ctx.fill()
	}
	control(){
		if (joystickPos.x > 0 && this.x2 < gridsInX * _grid){
			this.x1 += 1 * this.paddleSpeed;
			this.x2 += 1 * this.paddleSpeed;
		}
		else if (joystickPos.x < 0 && this.x1 > 0){
			this.x1 += -1 * this.paddleSpeed;
			this.x2 += -1 * this.paddleSpeed;
		}else{
			
		}
		this.draw();
	}
}
var mainPaddle = new Paddle(60,80,225,230,"white",4);
var enemyPaddle = new Paddle(60,80,10,15,"white",1.5);

class Ball{
	constructor(x1,x2,y1,y2,velocity_x,velocity_y,speed){
		this.x1 = x1 * _grid;
		this.x2 = x2 * _grid;
		this.y1 = y1 * _grid;
		this.y2 = y2 * _grid;
		this.velocity_x = velocity_x * _grid;
		this.velocity_y = velocity_y * _grid;
		this.speed = speed;
	}
	//triggerBounce(){
		
//	}
//	triggerBounceWall(){
		
//	}
	draw(){
		console.log("ya")
		ctx.beginPath();
		ctx.rect(this.x1,this.y1,this.x2-this.x1,this.y2-this.y1);
		ctx.fillStyle = "white";
		ctx.fill();
	}
	update(){
		this.testCollision()
		this.x1 += this.velocity_x * this.speed;
		this.x2 += this.velocity_x * this.speed;
		this.y1 += this.velocity_y * this.speed;
		this.y2 += this.velocity_y * this.speed;
		this.draw();
	}
	testCollision(){
		if (this.y2 > mainPaddle.y1 && this.y1 < mainPaddle.y2 && this.x2 > mainPaddle.x1 && this.x1 < mainPaddle.x2){
			if (this.velocity_y >= 0){
			this.velocity_y *= -1;
			}
		}
		else if (this.x2 > gridsInX*_grid || this.x1 < 0){
			this.velocity_x *= -1;
		}
		else if (this.y2 > gridsInY*_grid || this.y1 < 0){
			this.velocity_y *= -1;
			
		}
	}
	
}

var ball = new Ball(70,75,120,125,1,1,3)

gameState = {
	
}