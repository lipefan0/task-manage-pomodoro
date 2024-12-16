import { PomodoroTimer } from './src/pomodoro.js';
import { TaskManager } from './src/taskManager.js';
import { Timer } from './src/components/Timer.js';
import { TaskList } from './src/components/TaskList.js';
import './style.css';

// Create main container
const app = document.querySelector('#app');
const container = document.createElement('div');
container.className = 'container';
app.appendChild(container);

// Create timer container
const timerContainer = document.createElement('div');
timerContainer.className = 'timer-container';
container.appendChild(timerContainer);

// Initialize components
const taskManager = new TaskManager();
const timerComponent = new Timer(timerContainer);
const taskList = new TaskList(container, taskManager);

// Initialize Pomodoro timer
const pomodoro = new PomodoroTimer(
  (time) => timerComponent.updateDisplay(time),
  (isRunning, isBreak) => timerComponent.updateState(isRunning, isBreak)
);

// Setup timer controls
timerComponent.onStart(() => {
  if (pomodoro.isRunning) {
    pomodoro.pause();
  } else {
    pomodoro.start();
  }
});

timerComponent.onReset(() => {
  pomodoro.reset();
});

// Initial render
pomodoro.reset();

// Check for expired tasks periodically
const CACHE_CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour
setInterval(() => {
  taskManager.clearExpiredTasks();
  taskList.render();
}, CACHE_CHECK_INTERVAL);