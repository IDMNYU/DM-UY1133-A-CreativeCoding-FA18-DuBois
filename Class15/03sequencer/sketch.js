
// this is the main Tone synthesizer:
var vol = new Tone.Volume(-6).toMaster();;
var pingpong = new Tone.PingPongDelay(0.25, 0.3).connect(vol); // delay time, echo amount
var chorus = new Tone.Chorus(4, 2.5, 0.5);
var synth = new Tone.Synth().connect(chorus);
chorus.connect(pingpong);
chorus.toMaster();


Tone.Transport.start();

var synthpart = new Tone.Sequence(function(time, note){
			synth.triggerAttackRelease(note, .25, time);
		}, [50, [100, 200], 300, [200, 500, 400], 100, [200, 400], 100, 600]).start(0);


// var synthpart = new Tone.Sequence(function(time, note){
// 			plucksynth.triggerAttackRelease(note, "16n", time);
// 		}, ["C2", ["C3", ["C3", "D2"]], "E2", ["D2", "A1"]]).start(0);



function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255, 0, 0);
}

function draw() {
  fill(0);
  // put drawing code here
}

function mousePressed() {
  //synth.triggerAttackRelease('C4', '8n'); // plays a note (musical values)

  var freq = map(mouseY, 0, height, 500, 50);
  synth.triggerAttackRelease(freq, 0.1); // plays a note (mathematical values)
  ellipse(mouseX, mouseY, 50, 50);
}
