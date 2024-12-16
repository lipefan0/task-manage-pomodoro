let timer = null;
let timeLeft = 25 * 60; // Initialize with 25 minutes
let isBreak = false;
let isRunning = false;

self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'START':
      if (data && data.timeLeft !== undefined) {
        timeLeft = data.timeLeft;
        isBreak = data.isBreak;
      }
      startTimer();
      break;
    case 'PAUSE':
      pauseTimer();
      break;
    case 'RESET':
      resetTimer(data?.isBreak || false);
      break;
    case 'SYNC':
      syncTimer();
      break;
  }
};

function startTimer() {
  isRunning = true;
  
  if (!timer) {
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        notifyTick();
      } else {
        isBreak = !isBreak;
        timeLeft = isBreak ? 5 * 60 : 25 * 60;
        notifyStateChange();
      }
      
      saveState();
    }, 1000);
  }
  
  notifyStateChange();
}

function pauseTimer() {
  isRunning = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  saveState();
  notifyStateChange();
}

function resetTimer(breakMode) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning = false;
  isBreak = breakMode;
  timeLeft = isBreak ? 5 * 60 : 25 * 60;
  saveState();
  notifyTick();
  notifyStateChange();
}

function syncTimer() {
  notifyTick();
  notifyStateChange();
}

function saveState() {
  self.postMessage({
    type: 'SAVE_STATE',
    data: { timeLeft, isBreak, isRunning }
  });
}

function notifyTick() {
  self.postMessage({
    type: 'TICK',
    data: { timeLeft }
  });
}

function notifyStateChange() {
  self.postMessage({
    type: 'STATE_CHANGE',
    data: { isRunning, isBreak }
  });
}