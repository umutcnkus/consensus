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

function calculateSpeed(laplacian, agents, distances) {
    d_x = numeric.dot(laplacian, agents);
    normalized_la = normalize_laplacian(laplacian);
    distances = numeric.dot(laplacian, distances);
    d_x = numeric.add(d_x, distances);
    return d_x
}
const add = (a, b) => a + b

function findDistances(n, magnitude, axis) {
    var distances = [];
    var distance = 0;
    for (i = 0; i < n; i++) {
        angle = findAngle(n, i);
        if (axis == 'x') distance += magnitude * cos(angle);
        else distance += magnitude * sin(angle);
        distances.push([distance]);
    }
    distances.unshift([0])
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
    var array = createArray(length);
    for (i = 0; i <= length; i++) {
        if (i != length) array[i] = [(distances[i + 1] - distances[i])];
        else array[i] = array[0] - array[i];
    }
    return array;
};

function makeAdjecencyMatrix(n) {
    var array = createArray(n, n);
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++) array[i][j] = 0;
    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            if (i == 0) {
                array[i][n - 1] = 1;
                array[i][i + 1] = 1;
            }
            else if (i == n - 1) {
                array[i][0] = 1;
                array[i][i - 1] = 1;
            }
            else if (array[j][i]) array[i][j] = array[j][i]
            else {
                array[i][i + 1] = 1;
                array[i][i - 1] = 1;
            }
        }
    }
    console.log(array);
    return array;
}

function makeLaplacianMatrix(adjacency) {
    length = adjacency.length;
    var array = createArray(length, length);
    for (i = 0; i < length; i++) {
        for (j = 0; j < length; j++) {
            if (i != j) array[i][j] = adjacency[i][j];
            else array[i][j] = -(adjacency[i].reduce(add) - adjacency[i][j]);
        }
    }
    console.log(array)
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

function normalize_laplacian(array) {
    length = array.length;
    normalized_array = createArray(length, length);
    for (i = 0; i < length; i++)
        for (j = 0; j < length; j++) normalized_array[i][j] = -array[i][j] / abs(array[i][j]);
    return normalized_array;
}