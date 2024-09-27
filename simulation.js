const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Variables to hold all objects
const powerSources = [];
const gridNodes = [];
const consumers = [];

const rangeRadius = 100; // Define the range radius for generators and grid nodes

class PowerSource {
  constructor(x, y, range, isGenerator = true) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.isGenerator = isGenerator;
    this.isActive = true;
    this.isDragging = false;
    this.radius = 20; // Size of the power source for rendering
    this.isPowered = isGenerator ? true : false; // Generators are powered if active
  }

  // Method to check if another object is within range
  isInRange(target) {
    const distance = Math.hypot(this.x - target.x, this.y - target.y);
    return distance <= this.range;
  }

  // Toggle the power source on/off
  toggle() {
    this.isActive = !this.isActive;
    updatePowerStatus();
    draw();
  }

  // Render the power source on the canvas
  draw(ctx) {
    // Draw the range circle
    ctx.beginPath();
    ctx.strokeStyle = this.isActive ? 'blue' : 'gray';
    ctx.setLineDash([5, 5]);
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw the power source itself
    ctx.beginPath();
    if (this.isGenerator) {
      ctx.fillStyle = this.isActive ? 'orange' : 'lightgray';
    } else {
      // Grid node color depends on whether it's powered
      ctx.fillStyle = this.isPowered ? 'yellow' : 'lightgray';
    }
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}

class Consumer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isPowered = false;
    this.isDragging = false;
    this.radius = 10; // Size of the consumer for rendering
  }

  // Render the consumer on the canvas
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.isPowered ? 'green' : 'red';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
}

// Functions to add objects
function addGenerator(x, y) {
  const generator = new PowerSource(x, y, rangeRadius, true);
  powerSources.push(generator);
  updatePowerStatus();
  draw();
}

function addGridNode(x, y) {
  const gridNode = new PowerSource(x, y, rangeRadius, false);
  gridNodes.push(gridNode);
  updatePowerStatus();
  draw();
}

function addConsumer(x, y) {
  const consumer = new Consumer(x, y);
  consumers.push(consumer);
  updatePowerStatus();
  draw();
}

// Update power status using BFS
function updatePowerStatus() {
  // Reset power status for all grid nodes and consumers
  for (let node of gridNodes) {
    node.isPowered = false;
  }
  for (let consumer of consumers) {
    consumer.isPowered = false;
  }

  // For each active generator, perform BFS
  for (let generator of powerSources) {
    if (!generator.isActive) continue;

    let queue = [];
    let visited = new Set();

    // Start BFS from the generator
    queue.push(generator);
    visited.add(generator);

    while (queue.length > 0) {
      let current = queue.shift();

      // Determine the targets: grid nodes and consumers
      let targets = [...gridNodes, ...consumers];

      for (let target of targets) {
        if (visited.has(target)) continue; // Skip if already visited

        // Check if the target is within range
        if (current.isInRange(target)) {
          if (target instanceof PowerSource) {
            // For grid nodes, proceed only if they are active
            if (!target.isActive) continue;

            target.isPowered = true;
            visited.add(target);
            queue.push(target); // Continue BFS from this node
          } else if (target instanceof Consumer) {
            // For consumers
            target.isPowered = true;
            visited.add(target);
            // Do not enqueue consumers
          }
        }
      }
    }
  }
}

// Rendering function
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw power sources (generators and grid nodes)
  for (let source of [...powerSources, ...gridNodes]) {
    source.draw(ctx);
  }

  // Draw consumers
  for (let consumer of consumers) {
    consumer.draw(ctx);
  }
}

// Mouse event handlers
let selectedObject = null;
let offsetX, offsetY;

// Helper function to detect object under the mouse
function getObjectAt(x, y) {
  // Check power sources first
  for (let source of [...powerSources, ...gridNodes]) {
    if (Math.hypot(source.x - x, source.y - y) <= source.radius) {
      return source;
    }
  }
  // Then check consumers
  for (let consumer of consumers) {
    if (Math.hypot(consumer.x - x, consumer.y - y) <= consumer.radius) {
      return consumer;
    }
  }
  return null;
}

// Mouse down event
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const obj = getObjectAt(x, y);

  if (obj) {
    // Right-click to toggle power sources
    if (e.button === 2 && obj instanceof PowerSource) {
      obj.toggle();
    } else {
      // Start dragging
      selectedObject = obj;
      selectedObject.isDragging = true;
      offsetX = x - selectedObject.x;
      offsetY = y - selectedObject.y;
    }
  }
});

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
  if (selectedObject && selectedObject.isDragging) {
    const rect = canvas.getBoundingClientRect();
    selectedObject.x = e.clientX - rect.left - offsetX;
    selectedObject.y = e.clientY - rect.top - offsetY;
    updatePowerStatus();
    draw();
  }
});

// Mouse up event
canvas.addEventListener('mouseup', () => {
  if (selectedObject) {
    selectedObject.isDragging = false;
    selectedObject = null;
  }
});

// Disable context menu on canvas to use right-click
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Placing new objects
let placingMode = null;

// Canvas click event for placing new objects
canvas.addEventListener('click', (e) => {
  if (placingMode) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (placingMode === 'generator') {
      addGenerator(x, y);
    } else if (placingMode === 'gridNode') {
      addGridNode(x, y);
    } else if (placingMode === 'consumer') {
      addConsumer(x, y);
    }

    placingMode = null; // Reset placing mode
  }
});

// Initial objects for demonstration
addGenerator(150, 150);
addGridNode(400, 150);
addConsumer(200, 300);
addConsumer(450, 200);
