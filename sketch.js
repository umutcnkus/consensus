var leaderMode = false;
var canvasHeight = 500;
var canvasWidth = $(window).width();

var AgentManager = new AgentManager();


function setup() {
    frameRate(60);
    angleMode(RADIANS);
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('#graphs');
    

    AgentManager.showLinesBetweenAgents = false;
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
    return mouseX < canvasWidth && mouseY < canvasHeight;
}
