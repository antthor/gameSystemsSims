# Power Grid Simulation

This is a simple interactive simulation of a power grid system built using HTML5 canvas and JavaScript. The simulation allows users to place generators, grid nodes, and consumers on the canvas. Consumers will change their color based on whether they are within the power range of a generator or grid node. Generators and grid nodes can be dragged and toggled on/off by the user.

## Features
- **Generators**: Power sources that provide energy to grid nodes and consumers within a defined range.
- **Grid Nodes**: Distribute power from generators to consumers. Grid nodes themselves must be powered by a generator to supply power.
- **Consumers**: Devices that change color based on their power status:
  - **Green**: Powered.
  - **Red**: Not powered.
- **Drag-and-drop functionality**: Users can move generators, grid nodes, and consumers by dragging them.
- **Toggle power**: Right-click to toggle generators and grid nodes on/off.
- **Dynamic updates**: Consumers and grid nodes update their status based on their proximity to active power sources in real-time.

## Installation and Setup

1. Clone or download this repository.
2. Open the `index.html` file in a modern browser (Chrome, Firefox, etc.).
3. The simulation will start with a basic setup including a generator, a grid node, and consumers.

### Directory Structure:
```
/root
  ├── index.html        # Entry point of the simulation
  ├── simulation.js     # Core simulation logic
  └── README.md         # This file
```

## Usage

1. **Adding Objects**:
   - **Clicking** on the canvas will place a generator, grid node, or consumer depending on the selected mode.
   - You can switch between placement modes in the JavaScript code (currently defaults to no selection mode after placing).
   
   To place a new object:
   - Enter the object type in `placingMode` variable in `simulation.js` (e.g., `'generator'`, `'gridNode'`, or `'consumer'`).
   - Click on the canvas to place the object at the desired location.

2. **Moving Objects**:
   - **Left-click and drag** any object (generator, grid node, or consumer) to move it to a new location on the canvas.

3. **Toggling Power**:
   - **Right-click** on a generator or grid node to toggle it on or off.
   - When toggled off, any connected consumers or grid nodes will lose power, and their color will change accordingly.

4. **Consumers**:
   - Consumers will turn green if they are within the active range of any generator or powered grid node.
   - They will turn red if they are not receiving power from any source.

## Customization

You can customize the simulation by adjusting the following variables in `simulation.js`:

- `rangeRadius`: The power range for generators and grid nodes.
- `isActive`: Default status for generators and grid nodes (active or inactive on startup).
- `radius`: Visual size of objects on the canvas.

## Controls

- **Left-click and drag**: Move objects around.
- **Right-click**: Toggle power sources (generators and grid nodes).
- **Click (when in placing mode)**: Place a new generator, grid node, or consumer.

## Code Explanation

### Core Classes:

1. **PowerSource**: Represents a generator or grid node with the following properties:
   - `x`, `y`: Position on the canvas.
   - `range`: The radius within which it provides power.
   - `isActive`: Whether the power source is active.
   - `isGenerator`: Determines if it's a generator (true) or grid node (false).
   
   It also has methods to check range, toggle on/off, and render the object on the canvas.

2. **Consumer**: Represents an object that requires power, with the following properties:
   - `x`, `y`: Position on the canvas.
   - `isPowered`: Boolean indicating whether it is receiving power.
   
   It has methods to render itself on the canvas.

### Simulation Logic:

The simulation runs through a **breadth-first search (BFS)** approach to propagate power from generators to grid nodes and consumers. This ensures that power is distributed properly even in complex grid setups.

- **updatePowerStatus()**: This function checks the status of each consumer and grid node by performing BFS from each active generator.
- **draw()**: This function handles rendering of all objects (generators, grid nodes, and consumers) on the canvas.

## Browser Compatibility

This simulation is built using the HTML5 canvas and should work in all modern browsers like Chrome, Firefox, and Edge.

## Future Enhancements

- UI to switch between placing modes (generator, grid node, consumer).
- Better handling of power distribution in overlapping ranges.
- Ability to save and load simulations.

## License

This project is open-source and free to use for educational or personal purposes.

## Author

Created by Antthor - With AI assistance.