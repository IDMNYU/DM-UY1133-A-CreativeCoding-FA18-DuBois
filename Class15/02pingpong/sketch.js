
// this is the main Tone synthesizer:
var pingpong = new Tone.PingPongDelay(0.75, 0.7).toMaster(); // delay time, echo amount
var chorus = new Tone.Chorus(4, 2.5, 0.5);
var plucksynth = new Tone.PluckSynth().connect(chorus);
plucksynth.resonance = 0.9;
plucksynth.dampening = 10000;
chorus.connect(pingpong);
chorus.toMaster();

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
  plucksynth.triggerAttackRelease(freq, 0.1); // plays a note (mathematical values)
  ellipse(mouseX, mouseY, 50, 50);
}
