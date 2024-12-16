import { Cache } from './utils/cache.js';

export class TaskManager {
  constructor() {
    this.cache = new Cache(24); // 24 hours expiration
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    const cachedTasks = this.cache.get('tasks');
    return cachedTasks || [];
  }

  addTask(title) {
    const task = {
      id: Date.now(),
      title,
      completed: false,
      pomodoros: 0,
      createdAt: Date.now()
    };
    this.tasks.push(task);
    this.save();
    return task;
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = Date.now();
      this.save();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  incrementPomodoro(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.pomodoros++;
      task.updatedAt = Date.now();
      this.save();
    }
  }

  save() {
    this.cache.set('tasks', this.tasks);
  }

  clearExpiredTasks() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    this.tasks = this.tasks.filter(task => {
      const lastModified = task.updatedAt || task.createdAt;
      return lastModified > oneDayAgo;
    });
    
    this.save();
  }
}