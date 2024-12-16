export class PomodoroTimer {
  constructor(onTick, onStateChange) {
    this.onTick = onTick;
    this.onStateChange = onStateChange;
    this.isRunning = false;
    this.isBreak = false;
    this.worker = new Worker(new URL('./workers/timerWorker.js', import.meta.url));
    this.setupWorkerListeners();
    this.loadState();
  }

  setupWorkerListeners() {
    this.worker.onmessage = (e) => {
      const { type, data } = e.data;
      
      switch (type) {
        case 'TICK':
          this.onTick(this.formatTime(data.timeLeft));
          break;
        case 'STATE_CHANGE':
          this.isRunning = data.isRunning;
          this.isBreak = data.isBreak;
          this.onStateChange(data.isRunning, data.isBreak);
          break;
        case 'SAVE_STATE':
          localStorage.setItem('pomodoroState', JSON.stringify(data));
          break;
      }
    };

    // Sync with worker when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.worker.postMessage({ type: 'SYNC' });
      }
    });
  }

  loadState() {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.isRunning = state.isRunning;
      this.isBreak = state.isBreak;
      
      if (state.isRunning) {
        this.worker.postMessage({ 
          type: 'START',
          data: { 
            timeLeft: state.timeLeft,
            isBreak: state.isBreak
          }
        });
      } else {
        this.worker.postMessage({ 
          type: 'RESET',
          data: { isBreak: state.isBreak }
        });
      }
    } else {
      this.reset();
    }
  }

  start() {
    this.worker.postMessage({ type: 'START' });
  }

  pause() {
    this.worker.postMessage({ type: 'PAUSE' });
  }

  reset() {
    this.worker.postMessage({ 
      type: 'RESET',
      data: { isBreak: this.isBreak }
    });
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}