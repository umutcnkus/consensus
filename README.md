# Consensus Control Simulation

![resim](https://user-images.githubusercontent.com/10044468/119818838-5e686980-bef8-11eb-94e5-938db8105cc0.png)

An interactive web-based simulation environment for consensus control theory and multi-agent systems. Visualize how agents achieve consensus using various network topologies and control algorithms.

### Visit

    umutcnkus.github.io/consensus

## Features

### Core Functionality
- **Interactive Simulation**: Click to add agents, drag to control leader
- **Real-time Visualization**: Watch agents converge to consensus in real-time
- **Multiple Graph Topologies**:
  - Ring (Local): Circular neighbor connections
  - Complete (Global): Fully connected network
  - Star: Central hub topology
  - Path: Linear chain topology
  - Random: Randomly distributed connections
  - Small World: Local connections with random long-range links

### Metrics & Analytics
- **Live Performance Metrics**:
  - Convergence error tracking
  - Average velocity monitoring
  - Real-time agent count
  - Simulation status
- **Interactive Charts**: Dual-axis time-series visualization powered by Chart.js
- **Data Export**: Export metrics to CSV for further analysis

### User Interface
- **Modern UI**: Clean, responsive design with Bootstrap 5
- **Dark Mode**: Toggle between light and dark themes
- **Intuitive Controls**:
  - Adjustable agent count (2-30 agents)
  - Max speed control
  - Target distance configuration
  - Display options (lines, trails, labels)

### Advanced Features
- **Agent Trails**: Visualize movement history
- **Leader Following Mode**: Control the leader agent with your mouse
- **Color Coding**: Leader (red) vs followers (blue)
- **Agent Labels**: Identify individual agents
- **State Management**: Save and load simulation configurations
- **Keyboard Shortcuts**:
  - `Space` - Start/Stop simulation
  - `R` - Randomize agent positions
  - `L` - Toggle communication lines
  - `T` - Toggle agent trails
  - `?` - Show help modal

### Educational Content
- Built-in help modal with theory explanations
- Tooltips for controls
- Graph topology descriptions
- Convergence metric explanations

## Technology Stack
- **P5.js** - Canvas rendering and animation
- **Bootstrap 5** - Modern, responsive UI framework
- **Chart.js** - Real-time data visualization
- **numeric.js** - Matrix operations for consensus algorithms
- **jQuery** - DOM manipulation

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/umutcnkus/consensus.git
```

2. Open `index.html` in a modern web browser

3. Start experimenting with different topologies and parameters!

## How It Works

The simulation implements consensus control algorithms based on graph Laplacian matrices. Each agent updates its position based on:
- The positions of its neighbors (defined by the graph topology)
- A target formation distance
- Consensus protocol dynamics

The system converges when all agents reach agreement on their relative positions according to the specified topology and distance constraints.

## Use Cases
- **Education**: Teaching distributed systems and control theory
- **Research**: Prototyping multi-agent algorithms
- **Demonstration**: Showcasing consensus protocols
- **Exploration**: Understanding network topology effects on convergence

## License
MIT License - See LICENSE file for details

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


