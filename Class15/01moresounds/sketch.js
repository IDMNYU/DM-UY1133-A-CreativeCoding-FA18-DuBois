
// this is the main Tone synthesizer:
var synth = new Tone.Synth().toMaster();

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  background(255, 0, 0);
}

function draw() {
  fill(0);
  ellipse(mouseX, mouseY, 50, 50);
  // put drawing code here
}

function keyTyped() {
  //synth.triggerAttackRelease('C4', '8n'); // plays a note (musical values)
  synth.triggerAttackRelease(150, 0.1); // plays a note (mathematical values)
}
