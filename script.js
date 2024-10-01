const grid = document.getElementById('grid');
const library = document.getElementById('library');
const message = document.getElementById('message');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const submitBtn = document.getElementById('submitBtn');
const hintBtn = document.getElementById('hintBtn');

let history = []; // for undo/redo
let currentState = [];
let redoStack = [];

// Initialize grid
for (let i = 0; i < 100; i++) {
  const gridCell = document.createElement('div');
  gridCell.id = `cell-${i}`;
  gridCell.addEventListener('dragover', allowDrop);
  gridCell.addEventListener('drop', drop);
  grid.appendChild(gridCell);
}

// Make draggable elements work
const draggables = document.querySelectorAll('.draggable');
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', drag);
});

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const part = document.getElementById(data);
  if (event.target.tagName === 'DIV') {
    // Track current state
    saveState();
    event.target.appendChild(part);
  }
}

function saveState() {
  // Save the current state of the grid for undo
  const gridState = Array.from(grid.children).map(cell => cell.innerHTML);
  history.push(gridState);
  redoStack = []; // clear redo stack on new action
}

function undo() {
  if (history.length > 0) {
    redoStack.push(history.pop());
    restoreState(history[history.length - 1]);
  }
}

function redo() {
  if (redoStack.length > 0) {
    const lastState = redoStack.pop();
    restoreState(lastState);
    history.push(lastState);
  }
}

function restoreState(state) {
  if (state) {
    grid.innerHTML = ''; // clear grid
    state.forEach((content, index) => {
      const cell = document.createElement('div');
      cell.id = `cell-${index}`;
      cell.innerHTML = content;
      cell.addEventListener('dragover', allowDrop);
      cell.addEventListener('drop', drop);
      grid.appendChild(cell);
    });
  }
}

undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

submitBtn.addEventListener('click', () => {
  if (isCorrectConnection()) {
    message.textContent = 'Right Connection!';
    message.style.color = 'green';
  } else {
    message.textContent = 'Wrong Connection!';
    message.style.color = 'red';
  }
});

hintBtn.addEventListener('click', () => {
  message.textContent = 'Hint: Connect Blade to Hub!';
  setTimeout(() => {
    message.textContent = '';
  }, 2000);
});

// Example function to check the correctness of the connection
function isCorrectConnection() {
  const cells = Array.from(grid.children);
  const correctConnection = cells[4].innerHTML.includes('blade') &&
                            cells[14].innerHTML.includes('hub');
  return correctConnection;
}
