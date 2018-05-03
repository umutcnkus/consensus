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
var x_array = [];
var y_array = [];
var leader;
var speed_limit;

function setup() {
    var canvas = createCanvas(windowWidth, 500);
    canvas.parent('#graphs')
    total_agents = createSlider(0, 20, 1);
    total_agents.parent('#total-agents');
    total_agents.changed(resetAgents);
    max_speed = createSlider(0, 20, 10);
    max_speed.parent('#max-speed');
    a = createSprite(random(800), random(500), 10, 10);
    b = createSprite(random(800), random(500), 10, 10);
    c = createSprite(random(800), random(500), 10, 10);
    distances_x = findDistances(3, 50, 'x');
    distances_y = findDistances(3, 50, 'y');
    adjecency = makeAdjecencyMatrix(3, 0);
    frameRate(60);
    angleMode(RADIANS);
    laplacian = makeLaplacianMatrix(adjecency);
}

function draw() {
    background(200);
    drawSprites();
    agents_count = allSprites.length;
    leader = parseInt($('#leader').val());
    updateLocations();
    speed_array_x = calculateSpeed(laplacian, position_array_x, distances_x);
    speed_array_y = calculateSpeed(laplacian, position_array_y, distances_y);
    updateVelocities(speed_array_x, speed_array_y);
    drawLines();
    if (leader & inRange()) {
        allSprites[0].position.x = mouseX;
        allSprites[0].position.y = mouseY;
    }
    x_array.push(allSprites[0].position.x);
    y_array.push(allSprites[0].position.y);
}

function mouseClicked() {
    if (mouseX < windowWidth && mouseY < 500) {
        createSprite(mouseX, mouseY, 10, 10);
        structure = parseInt($('#graph_structure').val())
        agents_count += 1;
        distances_x = findDistances(agents_count, 50, 'x');
        distances_y = findDistances(agents_count, 50, 'y');
        adjecency = makeAdjecencyMatrix(agents_count, structure);
        laplacian = makeLaplacianMatrix(adjecency);
    }
}

function followMouse() {
    this.position.x = mouseX;
    this.position.y = mouseY;
}

function inRange() {
    return mouseX < windowWidth & mouseY < 500;
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
        s.setVelocity(speed_record_x[i][0] / 20, speed_record_y[i][0] / 20);
        s.limitSpeed(max_speed.value());
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

function randomize() {
    for (i = 0; i < allSprites.length; i++) {
        s1 = allSprites[i];
        s1.position.x = random(800);
        s1.position.y = random(500);
    }
}

function resetAgents() {
    allSprites.clear();
    addMultipleSprites(total_agents.value());
}

function addMultipleSprites(n) {
    for (i = 0; i < n; i++) {
        createSprite(canvas.height, canvas.width, 10, 10)
    }
}

function draw_graph(agent, value_array) {
    var time_series = [];
    var time = 0;
    n = value_array.length;
    for (i = 0; i < n; i++) {
        time_series.push(time);
        time += 0.1;
    }
    new Chart(document.getElementById("line-chart"), {
        type: 'line'
        , data: {
            labels: time_series
            , datasets: [{
                    data: value_array
                    , label: "Africa"
                    , borderColor: "#3e95cd"
                    , fill: false
      }
    ]
        }
        , options: {
            title: {
                display: true
                , text: 'World population per region (in millions)'
            }
        }
    })
}