
// this is the main Tone synthesizer:
var vol = new Tone.Volume(-6).toMaster();;
var pingpong = new Tone.PingPongDelay(0.25, 0.3).connect(vol); // delay time, echo amount
var chorus = new Tone.Chorus(4, 2.5, 0.5);
var sampler = new Tone.Sampler({
  "C4" : "./meow.mp3"
}).connect(chorus);
chorus.connect(pingpong);
chorus.toMaster();


Tone.Transport.start();

var synthpart = new Tone.Sequence(function(time, note){
			sampler.triggerAttackRelease(note, .25, time);
		}, [100, 100, 100, 100, 100, 100, 100, 100]).start(0);


// var synthpart = new Tone.Sequence(function(time, note){
// 			plucksynth.triggerAttackRelease(note, "16n", time);
// 		}, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start(0);

var sliders = new Array(8);

function setup() {
  // put setup code here
  createCanvas(800, 400);
}

function draw() {
  background(255, 0, 0);
  fill(0);
  for(let i = 0;i<8;i++)
  {
    rect(i*width/8, height, width/8*0.8, -sliders[i]);
  }

  // put drawing code here
}

function mouseDragged() {
  var which = floor(mouseX/width*8);
  sliders[which] = height-mouseY;
  var freq = map(sliders[which], 0, height, 200, 1000);
  synthpart.at(which, freq);
}
