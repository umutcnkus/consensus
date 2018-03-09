function cumtrapz(initial, time_series, array) {
    var time_previous = 0;
    var value_previous = initial;
    var sum = 0;
    var result = [];
    var cumulative_result = [];
    var area_previous = 0;
    var edge_1 = 0;
    var edge_2 = 0;
    var time_now = 0;
    var time_passed = 0;
    var value_now = 0;
    var cumulative_area = initial;
    for (i = 0; i < time_series.length; i++) {
        value_now = array[i];
        time_now = time_series[i];
        time_passed = time_now - time_previous;
        edge_1 = value_previous;
        edge_2 = value_now;
        high = time_passed;
        area = high * (edge_1 + edge_2) / 2;
        cumulative_area += area;
        cumulative_result.push(cumulative_area);
        area_previous = area;
        time_previous = time_now;
        value_previous = value_now;
    }
    return cumulative_result;
}

function trapz(initial, time_series, array) {
    var time_previous = 0;
    var value_previous = initial;
    var sum = 0;
    var result = [];
    var cumulative_result = [];
    var area_previous = 0;
    var edge_1 = 0;
    var edge_2 = 0;
    var time_now = 0;
    var time_passed = 0;
    var value_now = 0;
    var cumulative_area = initial;
    for (i = 0; i < time_series.length; i++) {
        value_now = array[i];
        time_now = time_series[i];
        time_passed = time_now - time_previous;
        edge_1 = value_previous;
        edge_2 = value_now;
        high = time_passed;
        area = high * (edge_1 + edge_2) / 2;
        cumulative_area += area;
        cumulative_result.push(cumulative_area);
        area_previous = area;
        time_previous = time_now;
        value_previous = value_now;
    }
    return cumulative_area;
}

function calculateSpeedX(laplacian, agents, distances) {
    d_x = numeric.dot(laplacian, agents);
    distances = numeric.dot(laplacian, distances);
    d_x1 = -((x1 - x2 - 30) + (x1 - x3 + 30));
    d_x2 = -((x2 - x3 + 60) + (x2 - x1 + 30));
    d_x3 = -((x3 - x1 - 30) + (x3 - x2 - 60));
    return [d_x1, d_x2, d_x3]
}

function calculateSpeedY(y1, y2, y3) {
    d_y1 = -(2 * (y1 - y2 - 50.1962) + 7 * (y1 - y3 - 50.1962))
    d_y2 = -(5 * (y2 - y3) + 2 * (y2 - y1 + 50.1962))
    d_y3 = -(7 * (y3 - y1 + 50.1962) + 5 * (y3 - y2))
    return [d_y1, d_y2, d_y3]
}
const add = (a, b) => a + b

function findDistances(n, magnitude, axis) {
    var distances = [];
    var distance = 0;
    for (i = 0; i < n; i++) {
        angle = findAngle(n, i);
        if (axis == 'x') distance += magnitude * cos(angle);
        else distance += magnitude * sin(angle);
        distances.push(distance);
    }
    distances.unshift(0)
    distances.pop()
    return distances;
}

function findAngle(total_edges, current_edge) {
    var exterior_angle = TWO_PI / total_edges;
    angle = current_edge * exterior_angle;
    if (angle > TWO_PI) angle -= TWO_PI;
    return angle;
}

function makeDistanceMatrix(distances) {
    length = distances.length;
    var array = createArray(n);
    for (i = 0; i <= length; i++) {
        if (i != length) array[i] = (distances[i + 1] - distances[i]);
        else array[i] = array[0] - array[i];
    }
};

function makeAdjecencyMatrix(n) {
    var array = createArray(n, n);
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            if (i != j && array[j][i]) array[i][j] = array[j][i];
            else if (i != j) array[i][j] = Math.ceil(random(1, 5));
            else array[i][j] = 0;
        }
    }
    return array;
}

function makeLaplacianMatrix(adjacency) {
    length = adjacency.length;
    var array = createArray(length, length);
    for (i = 0; i < length; i++) {
        for (j = 0; j < length; j++) {
            if (i != j) array[i][j] = -adjacency[i][j];
            else array[i][j] = (adjacency[i].reduce(add) - adjacency[i][j]);
        }
    }
    return array
}

function createArray(length) {
    var arr = new Array(length || 0)
        , i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}