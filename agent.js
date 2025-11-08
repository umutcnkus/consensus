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

    // Formation control
    this.formationType = 'none';
    this.formationSize = 100;
    this.formationTargets = [];

    // Interaction controls
    this.dragMode = true;
    this.draggedAgent = null;
    this.selectedAgents = [];
    this.lockedAgents = [];

    // Color scheme for agents
    this.colors = {
        leader: '#ef4444',      // Red for leader
        follower: '#3b82f6',    // Blue for followers
        trail: '#94a3b8',       // Gray for trails
        selected: '#fbbf24',    // Yellow for selected
        locked: '#9333ea'       // Purple for locked
    };

    this.initialize = () => {
        for (let i = 0; i < 3; i++) {
            this.createAgent(random(canvasWidth), random(canvasHeight));
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

        // Apply formation control
        this.applyFormationControl();

        // Update trails
        if (this.showTrails) {
            this.updateTrails();
            this.drawTrails();
        }

        // Draw formation targets
        this.drawFormationTargets();

        // Draw communication lines
        if (this.showLinesBetweenAgents) {
            this.showLines();
        }

        // Color agents based on state
        for (let i = 0; i < allSprites.length; i++) {
            if (this.isAgentLocked(i)) {
                allSprites[i].shapeColor = color(this.colors.locked);
            } else if (this.isAgentSelected(i)) {
                allSprites[i].shapeColor = color(this.colors.selected);
            } else if (i === 0) {
                allSprites[i].shapeColor = color(this.colors.leader);
            } else {
                allSprites[i].shapeColor = color(this.colors.follower);
            }
        }

        // Draw sprites
        drawSprites();

        // Draw selection indicators
        this.drawSelectionIndicators();

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
        this.selectedAgents = [];
        this.lockedAgents = [];
        this.createMultipleAgents(numOfAgents);
        this.calculateFormationTargets();
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

    // Formation Control Methods
    this.setFormation = (formationType) => {
        this.formationType = formationType;
        this.calculateFormationTargets();

        // Show/hide formation size slider
        const container = document.getElementById('formationSizeContainer');
        if (formationType !== 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    };

    this.setFormationSize = (size) => {
        this.formationSize = size;
        this.calculateFormationTargets();
    };

    this.calculateFormationTargets = () => {
        if (this.formationType === 'none' || allSprites.length === 0) {
            this.formationTargets = [];
            return;
        }

        const n = allSprites.length;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = this.formationSize;

        this.formationTargets = [];

        switch(this.formationType) {
            case 'circle':
                for (let i = 0; i < n; i++) {
                    const angle = (TWO_PI / n) * i;
                    this.formationTargets.push([
                        centerX + radius * cos(angle),
                        centerY + radius * sin(angle)
                    ]);
                }
                break;

            case 'line':
                const spacing = radius * 2 / (n - 1);
                for (let i = 0; i < n; i++) {
                    this.formationTargets.push([
                        centerX - radius + spacing * i,
                        centerY
                    ]);
                }
                break;

            case 'triangle':
                if (n >= 3) {
                    for (let i = 0; i < n; i++) {
                        const angle = (TWO_PI / 3) * (i % 3) - PI / 2;
                        const r = radius * (1 + Math.floor(i / 3) * 0.5);
                        this.formationTargets.push([
                            centerX + r * cos(angle),
                            centerY + r * sin(angle)
                        ]);
                    }
                } else {
                    // Fall back to circle for < 3 agents
                    for (let i = 0; i < n; i++) {
                        const angle = (TWO_PI / n) * i;
                        this.formationTargets.push([
                            centerX + radius * cos(angle),
                            centerY + radius * sin(angle)
                        ]);
                    }
                }
                break;

            case 'square':
                if (n >= 4) {
                    const perAgent = Math.ceil(n / 4);
                    let idx = 0;
                    // Top edge
                    for (let i = 0; i < perAgent && idx < n; i++, idx++) {
                        this.formationTargets.push([
                            centerX - radius + (radius * 2 * i / (perAgent - 1 || 1)),
                            centerY - radius
                        ]);
                    }
                    // Right edge
                    for (let i = 0; i < perAgent && idx < n; i++, idx++) {
                        this.formationTargets.push([
                            centerX + radius,
                            centerY - radius + (radius * 2 * i / (perAgent - 1 || 1))
                        ]);
                    }
                    // Bottom edge
                    for (let i = 0; i < perAgent && idx < n; i++, idx++) {
                        this.formationTargets.push([
                            centerX + radius - (radius * 2 * i / (perAgent - 1 || 1)),
                            centerY + radius
                        ]);
                    }
                    // Left edge
                    for (let i = 0; i < perAgent && idx < n; i++, idx++) {
                        this.formationTargets.push([
                            centerX - radius,
                            centerY + radius - (radius * 2 * i / (perAgent - 1 || 1))
                        ]);
                    }
                } else {
                    // Fall back to circle
                    for (let i = 0; i < n; i++) {
                        const angle = (TWO_PI / n) * i;
                        this.formationTargets.push([
                            centerX + radius * cos(angle),
                            centerY + radius * sin(angle)
                        ]);
                    }
                }
                break;

            case 'grid':
                const cols = Math.ceil(Math.sqrt(n));
                const rows = Math.ceil(n / cols);
                const spacingX = (radius * 2) / (cols - 1 || 1);
                const spacingY = (radius * 2) / (rows - 1 || 1);
                for (let i = 0; i < n; i++) {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    this.formationTargets.push([
                        centerX - radius + col * spacingX,
                        centerY - radius + row * spacingY
                    ]);
                }
                break;
        }
    };

    this.applyFormationControl = () => {
        if (this.formationType === 'none' || this.formationTargets.length === 0) {
            return;
        }

        // Apply formation forces
        for (let i = 0; i < Math.min(allSprites.length, this.formationTargets.length); i++) {
            if (this.isAgentLocked(i)) continue; // Skip locked agents

            const sprite = allSprites[i];
            const target = this.formationTargets[i];

            const dx = target[0] - sprite.position.x;
            const dy = target[1] - sprite.position.y;

            // Add formation attraction force
            const formationForce = 0.02; // Adjust this for stronger/weaker formation
            sprite.velocity.x += dx * formationForce;
            sprite.velocity.y += dy * formationForce;
        }
    };

    this.drawFormationTargets = () => {
        if (this.formationType === 'none' || this.formationTargets.length === 0) {
            return;
        }

        const isDarkMode = document.body.classList.contains('dark-mode');
        stroke(isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)');
        strokeWeight(1);
        noFill();

        // Draw target positions
        for (let i = 0; i < this.formationTargets.length; i++) {
            const target = this.formationTargets[i];
            circle(target[0], target[1], this.agentSize * 1.5);
        }

        noStroke();
    };

    // Interaction Methods
    this.setDragMode = (enabled) => {
        this.dragMode = enabled;
    };

    this.getAgentAtPosition = (x, y) => {
        for (let i = 0; i < allSprites.length; i++) {
            const s = allSprites[i];
            const dist = Math.sqrt((s.position.x - x) ** 2 + (s.position.y - y) ** 2);
            if (dist < this.agentSize) {
                return i;
            }
        }
        return -1;
    };

    this.startDragging = (agentIndex) => {
        if (agentIndex >= 0 && agentIndex < allSprites.length) {
            this.draggedAgent = agentIndex;
        }
    };

    this.updateDrag = (x, y) => {
        if (this.draggedAgent !== null && this.draggedAgent >= 0) {
            allSprites[this.draggedAgent].position.x = x;
            allSprites[this.draggedAgent].position.y = y;
            allSprites[this.draggedAgent].velocity.x = 0;
            allSprites[this.draggedAgent].velocity.y = 0;
        }
    };

    this.stopDragging = () => {
        this.draggedAgent = null;
    };

    this.deleteAgent = (agentIndex) => {
        if (agentIndex >= 0 && agentIndex < allSprites.length) {
            allSprites[agentIndex].remove();
            this.agentTrails.splice(agentIndex, 1);
            this.agentCount--;

            // Update selected/locked arrays
            this.selectedAgents = this.selectedAgents.filter(i => i !== agentIndex).map(i => i > agentIndex ? i - 1 : i);
            this.lockedAgents = this.lockedAgents.filter(i => i !== agentIndex).map(i => i > agentIndex ? i - 1 : i);

            this.calculateScene();
            this.calculateFormationTargets();
            updateAgentCountDisplay();
        }
    };

    this.toggleSelection = (agentIndex) => {
        const idx = this.selectedAgents.indexOf(agentIndex);
        if (idx > -1) {
            this.selectedAgents.splice(idx, 1);
        } else {
            this.selectedAgents.push(agentIndex);
        }
    };

    this.toggleLock = (agentIndex) => {
        const idx = this.lockedAgents.indexOf(agentIndex);
        if (idx > -1) {
            this.lockedAgents.splice(idx, 1);
        } else {
            this.lockedAgents.push(agentIndex);
        }
    };

    this.isAgentSelected = (agentIndex) => {
        return this.selectedAgents.includes(agentIndex);
    };

    this.isAgentLocked = (agentIndex) => {
        return this.lockedAgents.includes(agentIndex);
    };

    this.drawSelectionIndicators = () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        noFill();
        strokeWeight(2);

        // Draw selection rings
        for (let i = 0; i < this.selectedAgents.length; i++) {
            const agentIndex = this.selectedAgents[i];
            if (agentIndex < allSprites.length) {
                const s = allSprites[agentIndex];
                stroke(this.colors.selected);
                circle(s.position.x, s.position.y, this.agentSize * 2.5);
            }
        }

        // Draw lock indicators
        for (let i = 0; i < this.lockedAgents.length; i++) {
            const agentIndex = this.lockedAgents[i];
            if (agentIndex < allSprites.length) {
                const s = allSprites[agentIndex];
                stroke(this.colors.locked);
                strokeWeight(3);
                circle(s.position.x, s.position.y, this.agentSize * 2);
            }
        }

        noStroke();
    };
};
