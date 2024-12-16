export class NotificationManager {
  constructor() {
    this.hasPermission = false;
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  notify(title, options = {}) {
    if (this.hasPermission) {
      return new Notification(title, {
        icon: '/pomodoro.png',
        ...options
      });
    }
  }
}