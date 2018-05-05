var leaderMode = false;
var canvasHeight = 500;

var AgentManager = new AgentManager();


function setup() {
    frameRate(60);
    angleMode(RADIANS);

    var canvas = createCanvas(windowWidth, canvasHeight);
    canvas.parent('#graphs');

    AgentManager.showLinesBetweenAgents = true;
    AgentManager.initialize();
}


function draw() {
    background(200);

    AgentManager.showAgents();

    if (leaderMode && isMouseOnCanvas()) {
        AgentManager.setLeaderPosition(mouseX, mouseY);
    }
}


function mouseClicked() {
    if (isMouseOnCanvas()) {
        AgentManager.createAgent(mouseX, mouseY);
    }
}


function isMouseOnCanvas() {
    return mouseX < canvas.width/2 && mouseY < canvas.height/2;
}
