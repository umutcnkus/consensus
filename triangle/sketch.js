var position_ax = [];
var position_bx = [];
var position_cx = [];
var position_ay = [];
var position_by = [];
var position_cy = [];
var v_ax = [];
var v_ay = [];
var v_bx = [];
var v_by = [];
var v_cx = [];
var v_cy = [];

function setup() {
    createCanvas(1600, 1200);
    t = 0;
    t_series = [];
    a = createSprite(random(800), random(500), 10, 10);
    b = createSprite(random(800), random(500), 10, 10);
    c = createSprite(random(800), random(500), 10, 10);
    frameRate(10);
    angleMode(RADIANS);
}

function draw() {
    t_series.push(millis() / 1000);
    last_index = t_series.length - 1;
    background(255, 255, 255);
    drawSprites();
    x1 = a.position.x;
    x2 = b.position.x;
    x3 = c.position.x;
    y1 = a.position.y;
    y2 = b.position.y;
    y3 = c.position.y;
    position_ax.push(x1);
    position_bx.push(x2);
    position_cx.push(x3);
    position_ay.push(y1);
    position_by.push(y2);
    position_cy.push(y3);
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x1, y1);
    speed_array_x = calculateSpeedX(position_ax[last_index], position_bx[last_index], position_cx[last_index]);
    speed_array_y = calculateSpeedY(position_ay[last_index], position_by[last_index], position_cy[last_index]);
    v_ax.push(speed_array_x[0]);
    v_ay.push(speed_array_y[0]);
    v_bx.push(speed_array_x[1]);
    v_by.push(speed_array_y[1]);
    v_cx.push(speed_array_x[2]);
    v_cy.push(speed_array_y[2]);
    x_ax = trapz(210, t_series, v_ax);
    x_bx = trapz(310, t_series, v_bx);
    x_cx = trapz(110, t_series, v_cx);
    y_ax = trapz(210, t_series, v_ay);
    y_bx = trapz(310, t_series, v_by);
    y_bx = trapz(510, t_series, v_cy);
    a.setVelocity(v_ax[last_index] / 60, v_ay[last_index] / 60);
    b.setVelocity(v_bx[last_index] / 60, v_by[last_index] / 60);
    c.setVelocity(v_cx[last_index] / 60, v_cy[last_index] / 60);
}

function mouseClicked() {
    agent = random([1, 2, 3])
    if (agent == 1) {
        a = createSprite(mouseX, mouseY, 10, 10);
    }
    else if (agent == 2) {
        b = createSprite(mouseX, mouseY, 10, 10);
    }
    else {
        c = createSprite(mouseX, mouseY, 10, 10);
    }
}