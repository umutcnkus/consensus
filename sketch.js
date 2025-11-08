// Global Variables
let leaderMode = false;
let canvasHeight = 500;
let canvasWidth = window.innerWidth > 1200 ? window.innerWidth * 0.65 : window.innerWidth * 0.95;
let agentManager;
let metricsChart;
let metricsData = {
    time: [],
    convergenceError: [],
    avgVelocity: []
};

// Initialize on page load
function setup() {
    frameRate(60);
    angleMode(RADIANS);
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');

    // Initialize Agent Manager
    agentManager = new AgentManager();
    agentManager.showLinesBetweenAgents = false;
    agentManager.showTrails = false;
    agentManager.showLabels = true;
    agentManager.initialize();
    window.agentManager = agentManager;

    // Initialize Chart
    initializeChart();

    // Setup Event Listeners
    setupEventListeners();

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

function draw() {
    // Dynamic background based on dark mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    background(isDarkMode ? 30 : 200);

    // Show agents and update visualization
    agentManager.showAgents();

    // Leader following mode
    if (leaderMode && isMouseOnCanvas()) {
    agentManager.setLeaderPosition(mouseX, mouseY);
    }

    // Update metrics every frame
    updateMetrics();
}

function mouseClicked() {
    if (isMouseOnCanvas()) {
    agentManager.createAgent(mouseX, mouseY);
        updateAgentCountDisplay();
    }
}

function isMouseOnCanvas() {
    return mouseX >= 0 && mouseX < canvasWidth && mouseY >= 0 && mouseY < canvasHeight;
}

// Window resize handler
function windowResized() {
    canvasWidth = window.innerWidth > 1200 ? window.innerWidth * 0.65 : window.innerWidth * 0.95;
    resizeCanvas(canvasWidth, canvasHeight);
}

// Keyboard shortcuts
function keyPressed() {
    if (key === ' ') {
        // Space - Start/Stop
        SimControls.toggleStartStop();
        return false; // Prevent page scroll
    } else if (key === 'r' || key === 'R') {
        // R - Randomize
        SimControls.randomize();
    } else if (key === 'l' || key === 'L') {
        // L - Toggle Lines
        const checkbox = document.getElementById('showLines');
        checkbox.checked = !checkbox.checked;
    agentManager.setLineVisibility(checkbox.checked);
    } else if (key === 't' || key === 'T') {
        // T - Toggle Trails
        const checkbox = document.getElementById('showTrails');
        checkbox.checked = !checkbox.checked;
    agentManager.setTrailVisibility(checkbox.checked);
    } else if (key === '?') {
        // ? - Show Help
        const modal = new bootstrap.Modal(document.getElementById('helpModal'));
        modal.show();
    }
}

// Initialize Chart.js
function initializeChart() {
    const ctx = document.getElementById('metricsChart').getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');

    metricsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Convergence Error',
                data: [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Avg Velocity',
                data: [],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    labels: {
                        color: isDarkMode ? '#e2e8f0' : '#64748b'
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (frames)',
                        color: isDarkMode ? '#e2e8f0' : '#64748b'
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#64748b'
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Convergence Error',
                        color: 'rgb(239, 68, 68)'
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#64748b'
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Avg Velocity',
                        color: 'rgb(16, 185, 129)'
                    },
                    ticks: {
                        color: isDarkMode ? '#e2e8f0' : '#64748b'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

// Update metrics display
let frameCounter = 0;
function updateMetrics() {
    frameCounter++;

    // Update every 10 frames to avoid performance issues
    if (frameCounter % 10 !== 0) return;

    // Calculate convergence error
    const convergenceError = agentManager.calculateConvergenceError();
    document.getElementById('convergenceError').textContent = convergenceError.toFixed(2);

    // Calculate average velocity
    const avgVelocity = agentManager.calculateAverageVelocity();
    document.getElementById('avgVelocity').textContent = avgVelocity.toFixed(2);

    // Update chart data
    const timeLabel = Math.floor(frameCounter / 60); // Convert to seconds
    metricsData.time.push(timeLabel);
    metricsData.convergenceError.push(convergenceError);
    metricsData.avgVelocity.push(avgVelocity);

    // Keep only last 100 data points
    if (metricsData.time.length > 100) {
        metricsData.time.shift();
        metricsData.convergenceError.shift();
        metricsData.avgVelocity.shift();
    }

    // Update chart
    metricsChart.data.labels = metricsData.time;
    metricsChart.data.datasets[0].data = metricsData.convergenceError;
    metricsChart.data.datasets[1].data = metricsData.avgVelocity;
    metricsChart.update('none'); // Update without animation for performance
}

function updateAgentCountDisplay() {
    document.getElementById('agentCount').textContent = agentManager.agentCount;
    document.getElementById('agentCountValue').textContent = agentManager.agentCount;
}

// Setup event listeners
function setupEventListeners() {
    // Dark mode toggle
    document.getElementById('darkModeBtn').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-fill';
        }
        // Update chart colors
        updateChartTheme();
    });

    // Help button
    document.getElementById('helpBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('helpModal'));
        modal.show();
    });
}

function updateChartTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#64748b';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    metricsChart.options.plugins.legend.labels.color = textColor;
    metricsChart.options.scales.x.title.color = textColor;
    metricsChart.options.scales.x.ticks.color = textColor;
    metricsChart.options.scales.x.grid.color = gridColor;
    metricsChart.options.scales.y.ticks.color = textColor;
    metricsChart.options.scales.y.grid.color = gridColor;
    metricsChart.options.scales.y1.ticks.color = textColor;

    metricsChart.update();
}

// Simulation Controls Object
const SimControls = {
    isRunning: true,

    start: function() {
        agentManager.startScene();
        this.isRunning = true;
        this.updateStatus();
    },

    stop: function() {
        agentManager.stopScene();
        this.isRunning = false;
        this.updateStatus();
    },

    toggleStartStop: function() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    },

    reset: function() {
        metricsData.time = [];
        metricsData.convergenceError = [];
        metricsData.avgVelocity = [];
        frameCounter = 0;
        this.start();
    },

    randomize: function() {
        agentManager.randomize();
    },

    updateAgentCount: function(count) {
        document.getElementById('agentCountValue').textContent = count;
        agentManager.resetAgents(count);
        updateAgentCountDisplay();
    },

    updateMaxSpeed: function(speed) {
        document.getElementById('maxSpeedValue').textContent = speed;
        agentManager.updateMaxSpeed(speed);
    },

    updateDistance: function(distance) {
        document.getElementById('distanceValue').textContent = distance;
        agentManager.updateDistanceBetweenAgents(distance);
    },

    toggleLeaderMode: function(enabled) {
        leaderMode = enabled;
    },

    updateStatus: function() {
        const statusEl = document.getElementById('simStatus');
        if (this.isRunning) {
            statusEl.innerHTML = '<span class="badge bg-success">Running</span>';
        } else {
            statusEl.innerHTML = '<span class="badge bg-warning">Paused</span>';
        }
    },

    saveState: function() {
        const state = {
            agentCount: agentManager.agentCount,
            maxSpeed: agentManager.maxSpeed,
            distanceBetweenAgents: agentManager.distanceBetweenAgents,
            structure: agentManager.structure,
            agents: allSprites.map(s => ({
                x: s.position.x,
                y: s.position.y
            }))
        };

        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'consensus-simulation-state.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    loadState: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');

            reader.onload = readerEvent => {
                const state = JSON.parse(readerEvent.target.result);

                // Clear existing agents
                allSprites.clear();

                // Restore agents
                state.agents.forEach(agent => {
                    createSprite(agent.x, agent.y, agentManager.agentSize, agentManager.agentSize);
                });

                // Restore parameters
                agentManager.agentCount = state.agentCount;
                agentManager.maxSpeed = state.maxSpeed;
                agentManager.distanceBetweenAgents = state.distanceBetweenAgents;
                agentManager.structure = state.structure;

                // Update UI
                document.getElementById('agentCountSlider').value = state.agentCount;
                document.getElementById('maxSpeedSlider').value = state.maxSpeed;
                document.getElementById('distanceSlider').value = state.distanceBetweenAgents;
                document.getElementById('graphTopology').value = state.structure;

                SimControls.updateAgentCount(state.agentCount);
                SimControls.updateMaxSpeed(state.maxSpeed);
                SimControls.updateDistance(state.distanceBetweenAgents);

                agentManager.calculateScene();
            };
        };

        input.click();
    },

    exportData: function() {
        let csv = 'Time (frames),Convergence Error,Average Velocity\n';

        for (let i = 0; i < metricsData.time.length; i++) {
            csv += `${metricsData.time[i]},${metricsData.convergenceError[i]},${metricsData.avgVelocity[i]}\n`;
        }

        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        const exportFileDefaultName = 'consensus-metrics.csv';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
};

window.SimControls = SimControls;
