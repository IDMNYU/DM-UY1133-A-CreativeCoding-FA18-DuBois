var NUMROWS = 3;
var NUMCOLUMNS = 10;
var ALIENWIDTH = 40;
var ALIENHEIGHT = 40;
var ALIENHSPACING = 5;
var ALIENVSPACING = 5;
var DIFFICULTY = 1.01
var ALIENSPEED = 1; // HOW MANY PIXELS DO THE ALIENS MOVE
var ALIENCR = 20; // HOW MANY PIXELS DOWN DO THE ALIENS MOVE WHEN THEY HIT A WALL

var LEFTWALL, RIGHTWALL, TOPWALL, BOTTOMWALL;
var NUMLIVES = 3;
var MAXMISSILES = 3;

var aliens;
var missiles = [];
var ship;
var life = NUMLIVES;
var playing=false;
var drawing=true;
var flipit = 0;

var aliennoise, shipnoise, wallnoise, ughnoise, yaynoise;

var spritesheet;

function preload() {
	aliennoise = loadSound('./sounds/boink.mp3');
	shipnoise = loadSound('./sounds/burp.mp3');
	wallnoise = loadSound('./sounds/wall.mp3');
	ughnoise = loadSound('./sounds/ugh.mp3');
	yaynoise = loadSound('./sounds/yay.mp3');
	spritesheet = loadImage('./images/invaders.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	TOPWALL = height*0.1;
	BOTTOMWALL = height*0.9;
	LEFTWALL = width*0.2;
	RIGHTWALL = width*0.8;

	textSize(32);
	textAlign(CENTER);
}

function draw() {
	background(0);
	console.log(playing);

	if(playing)
	{
		if(aliens.length<1) {
			yaynoise.play();
			restartGame();
		}
		text(life, width*0.1, height*0.1);
		text((NUMROWS*NUMCOLUMNS)-aliens.length, width*0.9, height*0.1);
		drawWalls();

		ship.move(mouseX);

		for(let i = 0;i<aliens.length;i++)
		{
			aliens[i].draw();
			for(let j = 0;j<missiles.length;j++)
			{
				if(aliens[i].collide(missiles[j].x, missiles[j].y)) {
					missiles[j].bounce(aliens[i]);
					aliennoise.play();
				}
			}
			aliens[i].move(ALIENSPEED, 0);
		}
		for(let i = aliens.length-1;i>=0;i--)
		{
			if(!aliens[i].alive) aliens.splice(i, 1);
		}
		for(let i = missiles.length-1;i>=0;i--)
		{
			if(!missiles[i].alive) missiles.splice(i, 1);
		}

		ship.draw();
		for(let i = 0;i<missiles.length;i++)
		{
			missiles[i].draw();
		}

		if(flipit==1)
		{
			ALIENSPEED*=-1;
			for(let i = 0;i<aliens.length;i++)
			{
				aliens[i].move(0, ALIENCR);
			}
			flipit = 0;
		}

	}
	else {
		fill(255);
		if(frameCount/10%4<2)text("PRESS SPACEBAR", width/2, height/2);
	}

}

function restartGame()
{
	var wholestack = (ALIENWIDTH+ALIENHSPACING)*NUMCOLUMNS;
	var emptyspace = width-wholestack;
	var layerx = emptyspace/2;
	var layery = TOPWALL+ALIENHEIGHT*2;

	life = NUMLIVES;

	aliens = new Array(NUMROWS*NUMCOLUMNS);
	for(let i = 0;i<aliens.length;i++)
	{
		var c = i%NUMCOLUMNS;
		var r = floor(i/NUMCOLUMNS);
		console.log(i + ": " + c + " " + r);
		aliens[i] = new Alien(i, c*(ALIENWIDTH+ALIENHSPACING) + layerx, r*(ALIENHEIGHT+ALIENVSPACING) + layery, ALIENWIDTH, ALIENHEIGHT);
	}
	ship = new Ship();
	missile = new Missile();

	playing = true;
}

function newMissile()
{
	var m = new Missile();
	m.velocity=5;
	m.angle=-PI/2;
	m.x=ship.x + ship.w/2;
	m.y=BOTTOMWALL*0.9;
	missiles.push(m);
}

function doDead()
{
	life--;
	if(life>0)
	{
		missiles = [];
		var wholestack = (ALIENWIDTH+ALIENHSPACING)*NUMCOLUMNS;
		var emptyspace = width-wholestack;
		var layerx = emptyspace/2;
		var layery = TOPWALL+ALIENHEIGHT*2;
		for(let i = 0;i<aliens.length;i++)
		{
			var c = i%NUMCOLUMNS;
			var r = floor(i/NUMCOLUMNS);
			console.log(i + ": " + c + " " + r);
			aliens[i] = new Alien(i, c*(ALIENWIDTH+ALIENHSPACING) + layerx, r*(ALIENHEIGHT+ALIENVSPACING) + layery, ALIENWIDTH, ALIENHEIGHT);
		}
	}
	else {
		missiles = [];
		playing=false;
	}
}

function drawWalls()
{
	fill(255, 0, 255);
	rect(LEFTWALL, TOPWALL, 10, BOTTOMWALL-TOPWALL);
	rect(RIGHTWALL, TOPWALL, 10, BOTTOMWALL-TOPWALL);
	rect(LEFTWALL, TOPWALL, RIGHTWALL-LEFTWALL, 10);
	rect(LEFTWALL, BOTTOMWALL, RIGHTWALL-LEFTWALL, 10);
}

//
// in OOP:
// a variable is a property
// a function is a method
//

class Missile {
	constructor(x=width/2, y=BOTTOMWALL*0.5, v=5, a=PI/2) {
		this.x = x;
		this.y = y;
		this.px = x;
		this.py = y;
		this.velocity = v;
		this.angle = a;
		this.alive = true;
	}
	draw() {
		fill(255);
		rect(this.x, this.y, 5, 5);
		this.px = this.x;
		this.py = this.y;
		this.x = this.x + this.velocity * cos(this.angle);
		this.y = this.y + this.velocity* sin(this.angle);
		// boundary checking:
		if(this.y<TOPWALL) {
			this.alive = false;
		}
	}
	bounce(_alien)
	{
		this.alive = false;
	}
}

class Ship {
	constructor (x=width/2, y=BOTTOMWALL*0.9, w=60, h=10) { // this runs when ya make it
		// copy over the arguments to the class properties:
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.r = 255;
		this.g = 255;
		this.b = 255;
  }
	// this is the draw() method which runs whenever we call it:
  move(_x) {
		this.x = constrain(_x, LEFTWALL, RIGHTWALL);
  }
	// this is the draw() method which runs whenever we call it:
  draw() {
		fill(this.r, this.g, this.b);
		//rect(this.x, this.y, this.w, this.h);
		triangle(this.x, this.y+this.h, this.x+this.w/2, this.y-this.h, this.x+this.w, this.y+this.h);
  }
	collide(_x, _y)
	{
		if(_x>this.x&&_x<(this.x+this.w)&&_y>this.y&&_y<(this.y+this.h))
		{
			return(true);
		}
		else return(false);
	}


}

class Alien {
	constructor (id=0, x=width/2, y=height/2, w=10, h=10, sheet=spritesheet) { // this runs when ya make it
		// copy over the arguments to the class properties:
		this.id = id;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.sheet = sheet;
		this.nframes = 4; // how many frames in the sprite?
		this.frame = floor(random(this.nframes)); // which sprite in the sheet?
		this.spritespeed = 10; // how often do we change sprites?
		this.spriteheight = this.sheet.height;
		this.spritewidth = this.sheet.width/this.nframes;
		this.r = random(223)+32;
		this.g = random(223)+32;
		this.b = random(223)+32;
		this.alive = true;
  }
	// this is the draw() method which runs whenever we call it:
  draw() {
		if(this.alive) {
			tint(this.r, this.g, this.b);
      image(spritesheet, this.x, this.y, this.w, this.h, this.frame*this.spritewidth, 0, this.spritewidth, this.spriteheight);
			if(frameCount%this.spritespeed==0) this.frame = (this.frame+1)%this.nframes;
		}
  }
	move(_x, _y)
	{
		this.x+=_x;
		this.y+=_y;
		if(this.x+this.w>RIGHTWALL) flipit = 1;
		if(this.x<LEFTWALL) flipit = 1;
		if(this.y+this.h>BOTTOMWALL*0.9) {
			ughnoise.play();
			doDead();
		}
	}
	collide(_x, _y)
	{
		if(_x>this.x&&_x<(this.x+this.w)&&_y>this.y&&_y<(this.y+this.h))
		{
			this.alive = false;
			return(true);
		}
		else return(false);
	}
}

function keyPressed()
{
	console.log(key);
	if(key==' ' && playing==false)
	{
		restartGame();
	}
	if(key=='f')
	{
		if(missiles.length<MAXMISSILES) newMissile();
	}
	if(key=='p')
	{
		if(drawing) noLoop(); else loop();
		drawing = !drawing;
	}
}
