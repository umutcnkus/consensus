var AgentManager = function() {
    this.agentCount = 0;
    this.agentSize = 10;
    this.maxSpeed = 10;
    this.distanceBetweenAgents = 50;
    this.structure = 0;
    this.stopFlag = false;
    this.showLinesBetweenAgents = false;
    this.showTrails = false;
    this.showLabels = true;

    this.laplacian = [];
    this.position_x = [];
    this.position_y = [];
    this.velocity_x = [];
    this.velocity_y = [];
    this.distances_x = [];
    this.distances_y = [];

    // Trail storage for each agent
    this.agentTrails = [];
    this.maxTrailLength = 50;

    // Color scheme for agents
    this.colors = {
        leader: '#ef4444',      // Red for leader
        follower: '#3b82f6',    // Blue for followers
        trail: '#94a3b8'        // Gray for trails
    };

    this.initialize = () => {
        for (let i = 0; i < 3; i++) {
            AgentManager.createAgent(random(canvasWidth), random(canvasHeight));
        }
    };

    this.createAgent = (x, y) => {
        const sprite = createSprite(x, y, this.agentSize, this.agentSize);
        sprite.shapeColor = color(this.colors.follower);
        this.agentCount += 1;
        this.agentTrails.push([]);
        this.calculateScene();
    };

    this.createMultipleAgents = (numOfAgents) => {
        this.agentTrails = [];
        for (let i = 0; i < numOfAgents; i++) {
            let x = random(canvasWidth);
            let y = random(canvasHeight);
            const sprite = createSprite(x, y, this.agentSize, this.agentSize);
            sprite.shapeColor = color(this.colors.follower);
            this.agentTrails.push([]);
        }
        this.agentCount = numOfAgents;
        this.calculateScene();
    };

    this.showAgents = () => {
        this.updateLocations();
        this.calculateVelocities();
        this.updateVelocities();

        // Update trails
        if (this.showTrails) {
            this.updateTrails();
            this.drawTrails();
        }

        // Draw communication lines
        if (this.showLinesBetweenAgents) {
            this.showLines();
        }

        // Color the leader differently
        if (allSprites.length > 0) {
            allSprites[0].shapeColor = color(this.colors.leader);
        }

        // Draw sprites
        drawSprites();

        // Draw labels
        if (this.showLabels) {
            this.drawLabels();
        }
    };

    this.updateLocations = () => {
        this.position_x = [];
        this.position_y = [];
        for (let i = 0; i < allSprites.length; i++) {
            const s = allSprites[i];
            this.position_x.push([s.position.x]);
            this.position_y.push([s.position.y]);
        }
    };

    this.calculateVelocities = () => {
        const d_x = numeric.dot(this.laplacian, this.position_x);
        const d_y = numeric.dot(this.laplacian, this.position_y);
        const distances_x = numeric.dot(this.laplacian, this.distances_x);
        const distances_y = numeric.dot(this.laplacian, this.distances_y);
        this.velocity_x = numeric.add(d_x, distances_x);
        this.velocity_y = numeric.add(d_y, distances_y);
    };

    this.updateVelocities = () => {
        for (let i = 0; i < allSprites.length; i++) {
            const s = allSprites[i];
            s.setVelocity(this.velocity_x[i][0] / 20, this.velocity_y[i][0] / 20);
            if (!this.stopFlag) {
                s.limitSpeed(this.maxSpeed);
            } else {
                s.limitSpeed(0);
            }
        }
    };

    this.calculateScene = () => {
        const distance = this.distanceBetweenAgents;
        this.distances_x = findDistances(this.agentCount, distance, 'x');
        this.distances_y = findDistances(this.agentCount, distance, 'y');
        const adjacency = makeAdjacencyMatrix(this.agentCount, this.structure);
        this.laplacian = makeLaplacianMatrix(adjacency);
    };

    this.showLines = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        stroke(isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)');
        strokeWeight(1);

        const adjacency = makeAdjacencyMatrix(this.agentCount, this.structure);

        for (let i = 0; i < allSprites.length; i++) {
            const s1 = allSprites[i];
            for (let j = i + 1; j < allSprites.length; j++) {
                if (adjacency[i][j] === 1) {
                    const s2 = allSprites[j];
                    line(s1.position.x, s1.position.y, s2.position.x, s2.position.y);
                }
            }
        }
        noStroke();
    };

    this.updateTrails = () => {
        for (let i = 0; i < allSprites.length; i++) {
            const s = allSprites[i];
            if (this.agentTrails[i]) {
                this.agentTrails[i].push({x: s.position.x, y: s.position.y});

                // Limit trail length
                if (this.agentTrails[i].length > this.maxTrailLength) {
                    this.agentTrails[i].shift();
                }
            }
        }
    };

    this.drawTrails = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        noFill();
        strokeWeight(2);

        for (let i = 0; i < this.agentTrails.length; i++) {
            const trail = this.agentTrails[i];
            if (trail && trail.length > 1) {
                // Leader trail in red, others in blue
                const trailColor = i === 0 ? this.colors.leader : this.colors.follower;
                stroke(trailColor + '40'); // Add transparency

                beginShape();
                for (let j = 0; j < trail.length; j++) {
                    vertex(trail[j].x, trail[j].y);
                }
                endShape();
            }
        }
        noStroke();
    };

    this.drawLabels = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        fill(isDarkMode ? 255 : 0);
        textAlign(CENTER, CENTER);
        textSize(10);

        for (let i = 0; i < allSprites.length; i++) {
            const s = allSprites[i];
            const label = i === 0 ? 'L' : i.toString();
            text(label, s.position.x, s.position.y);
        }
    };

    this.startScene = () => {
        this.stopFlag = false;
    };

    this.stopScene = () => {
        this.stopFlag = true;
    };

    this.randomize = () => {
        for (let i = 0; i < allSprites.length; i++) {
            allSprites[i].position.x = random(canvasWidth);
            allSprites[i].position.y = random(canvasHeight);
        }
        // Clear trails on randomize
        this.agentTrails = allSprites.map(() => []);
    };

    this.resetAgents = (numOfAgents) => {
        allSprites.clear();
        this.createMultipleAgents(numOfAgents);
    };

    this.updateMaxSpeed = (newMaxSpeed) => {
        this.maxSpeed = newMaxSpeed;
    };

    this.updateDistanceBetweenAgents = (newDistance) => {
        this.distanceBetweenAgents = newDistance;
        this.calculateScene();
    };

    this.updateStructure = (newStructure) => {
        this.structure = newStructure;
        this.calculateScene();
    };

    this.setLeaderPosition = (x, y) => {
        if (allSprites.length > 0) {
            allSprites[0].position.x = x;
            allSprites[0].position.y = y;
        }
    };

    this.setLineVisibility = (visibility) => {
        this.showLinesBetweenAgents = visibility;
    };

    this.setTrailVisibility = (visibility) => {
        this.showTrails = visibility;
        if (!visibility) {
            // Clear trails when disabled
            this.agentTrails = allSprites.map(() => []);
        }
    };

    this.setLabelVisibility = (visibility) => {
        this.showLabels = visibility;
    };

    // Calculate convergence error (variance from average position)
    this.calculateConvergenceError = () => {
        if (allSprites.length === 0) return 0;

        // Calculate average position
        let avgX = 0, avgY = 0;
        for (let i = 0; i < allSprites.length; i++) {
            avgX += allSprites[i].position.x;
            avgY += allSprites[i].position.y;
        }
        avgX /= allSprites.length;
        avgY /= allSprites.length;

        // Calculate sum of squared distances from average
        let error = 0;
        for (let i = 0; i < allSprites.length; i++) {
            const dx = allSprites[i].position.x - avgX;
            const dy = allSprites[i].position.y - avgY;
            error += Math.sqrt(dx * dx + dy * dy);
        }

        return error / allSprites.length;
    };

    // Calculate average velocity
    this.calculateAverageVelocity = () => {
        if (allSprites.length === 0) return 0;

        let totalVelocity = 0;
        for (let i = 0; i < allSprites.length; i++) {
            const vx = allSprites[i].velocity.x;
            const vy = allSprites[i].velocity.y;
            totalVelocity += Math.sqrt(vx * vx + vy * vy);
        }

        return totalVelocity / allSprites.length;
    };
};
