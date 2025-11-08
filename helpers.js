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

const add = (a, b) => a + b;

function findDistances(n, magnitude, axis) {
    var distances = [];
    var distance = 0;
    for (i = 0; i < n; i++) {
        angle = findAngle(n, i);
        if (axis == 'x') distance += magnitude * cos(angle);
        else distance += magnitude * sin(angle);
        distances.push([distance]);
    }
    distances.unshift([0]);
    distances.pop();
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

function makeAdjacencyMatrix(n, structure) {
    var array = createArray(n, n);

    // Initialize with zeros
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            array[i][j] = 0;
        }
    }

    // No self-connections
    for (let i = 0; i < n; i++) {
        array[i][i] = 0;
    }

    switch(structure) {
        case 0: // Ring (Local) - Each node connects to neighbors in a circle
            for (let i = 0; i < n; i++) {
                array[i][(i + 1) % n] = 1;
                array[i][(i - 1 + n) % n] = 1;
            }
            break;

        case 1: // Complete (Global) - Every node connects to every other node
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i !== j) {
                        array[i][j] = 1;
                    }
                }
            }
            break;

        case 2: // Star - All nodes connect to a central hub (node 0)
            for (let i = 1; i < n; i++) {
                array[0][i] = 1;
                array[i][0] = 1;
            }
            break;

        case 3: // Path - Nodes form a linear chain
            for (let i = 0; i < n - 1; i++) {
                array[i][i + 1] = 1;
                array[i + 1][i] = 1;
            }
            break;

        case 4: // Random - Random connections with probability ~0.3
            for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                    if (Math.random() < 0.3) {
                        array[i][j] = 1;
                        array[j][i] = 1;
                    }
                }
            }
            // Ensure connectivity - add ring as base
            for (let i = 0; i < n; i++) {
                array[i][(i + 1) % n] = 1;
                array[(i + 1) % n][i] = 1;
            }
            break;

        case 5: // Small World - Ring with some random long-range connections
            // Start with ring
            for (let i = 0; i < n; i++) {
                array[i][(i + 1) % n] = 1;
                array[i][(i - 1 + n) % n] = 1;
            }
            // Add random long-range connections
            const numLongRange = Math.max(1, Math.floor(n * 0.2));
            for (let k = 0; k < numLongRange; k++) {
                const i = Math.floor(Math.random() * n);
                let j = Math.floor(Math.random() * n);
                // Ensure j is not adjacent to i
                while (j === i || j === (i + 1) % n || j === (i - 1 + n) % n) {
                    j = Math.floor(Math.random() * n);
                }
                array[i][j] = 1;
                array[j][i] = 1;
            }
            break;

        default:
            // Default to ring
            for (let i = 0; i < n; i++) {
                array[i][(i + 1) % n] = 1;
                array[i][(i - 1 + n) % n] = 1;
            }
    }

    return array;
}

function makeLaplacianMatrix(adjacency) {
    length = adjacency.length;
    var array = createArray(length, length);
    for (i = 0; i < length; i++) {
        for (j = 0; j < length; j++) {
            if (i != j) {
                // Off-diagonal: negative of adjacency
                array[i][j] = -adjacency[i][j];
            } else {
                // Diagonal: degree of node i (sum of connections)
                array[i][j] = adjacency[i].reduce(add, 0);
            }
        }
    }
    return array;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
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
