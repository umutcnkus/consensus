var position_array_x = [];
var position_array_y = [];
var v_ax = [];
var v_ay = [];
var v_bx = [];
var v_by = [];
var v_cx = [];
var v_cy = [];
var distances_x = [];
var distances_y = [];
var laplacian = 0;

function setup() {
    createCanvas(1600, 1200);
    a = createSprite(random(800), random(500), 10, 10);
    b = createSprite(random(800), random(500), 10, 10);
    c = createSprite(random(800), random(500), 10, 10);
    distances_x = findDistances(3, 50, 'x');
    distances_y = findDistances(3, 50, 'y');
    adjecency = makeAdjecencyMatrix(3);
    frameRate(10);
    angleMode(RADIANS);
    laplacian = makeLaplacianMatrix(adjecency);
}

function draw() {
    background(255, 255, 255);
    drawSprites();
    agents_count = allSprites.length;
    updateLocations();
    speed_array_x = calculateSpeed(laplacian, position_array_x, distances_x);
    speed_array_y = calculateSpeed(laplacian, position_array_y, distances_y);
    updateVelocities(speed_array_x, speed_array_y);
    drawLines();
}

function mouseClicked() {
    createSprite(mouseX, mouseY, 10, 10);
    agents_count += 1;
    distances_x = findDistances(agents_count, 50, 'x');
    distances_y = findDistances(agents_count, 50, 'y');
    adjecency = makeAdjecencyMatrix(agents_count);
    laplacian = makeLaplacianMatrix(adjecency);
}

function updateLocations() {
    position_array_x = [];
    position_array_y = [];
    for (i = 0; i < allSprites.length; i++) {
        s = allSprites[i];
        position_array_x.push([s.position.x]);
        position_array_y.push([s.position.y]);
    }
}

function updateVelocities(speed_record_x, speed_record_y) {
    for (i = 0; i < allSprites.length; i++) {
        s = allSprites[i];
        s.setVelocity(speed_record_x[i][0] / 4, speed_record_y[i][0] / 4);
    }
}

function drawLines() {
    for (i = 0; i < allSprites.length; i++) {
        s1 = allSprites[i];
        if (i != allSprites.length - 1) {
            s2 = allSprites[i + 1];
            line(s1.position.x, s1.position.y, s2.position.x, s2.position.y)
        }
        else line(s1.position.x, s1.position.y, allSprites[0].position.x, allSprites[0].position.y)
    }
}