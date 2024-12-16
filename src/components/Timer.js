export class Timer {
  constructor(element) {
    this.element = element;
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.className = 'timer-display';
    
    this.controls = document.createElement('div');
    this.controls.className = 'timer-controls';
    
    this.startButton = document.createElement('button');
    this.startButton.className = 'primary';
    this.startButton.textContent = 'Start';
    
    this.resetButton = document.createElement('button');
    this.resetButton.textContent = 'Reset';
    
    this.controls.append(this.startButton, this.resetButton);
    this.element.append(this.timerDisplay, this.controls);
  }

  updateDisplay(time) {
    this.timerDisplay.textContent = time;
  }

  updateState(isRunning, isBreak) {
    this.startButton.textContent = isRunning ? 'Pause' : 'Start';
    this.element.classList.toggle('break-mode', isBreak);
  }

  onStart(callback) {
    this.startButton.addEventListener('click', callback);
  }

  onReset(callback) {
    this.resetButton.addEventListener('click', callback);
  }
}