export class TaskList {
  constructor(element, taskManager) {
    this.element = element;
    this.taskManager = taskManager;
    this.setupTaskInput();
    this.taskListElement = document.createElement('div');
    this.taskListElement.className = 'task-list';
    this.element.appendChild(this.taskListElement);
    this.render();
  }

  setupTaskInput() {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'task-input';
    
    const input = document.createElement('input');
    input.placeholder = 'Adicionar nova tarefa...';
    
    const addButton = document.createElement('button');
    addButton.className = 'primary';
    addButton.textContent = 'Adicionar Tarefa';
    
    addButton.addEventListener('click', () => {
      if (input.value.trim()) {
        this.taskManager.addTask(input.value.trim());
        input.value = '';
        this.render();
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.taskManager.addTask(input.value.trim());
        input.value = '';
        this.render();
      }
    });

    inputContainer.append(input, addButton);
    this.element.appendChild(inputContainer);
  }

  render() {
    this.taskListElement.innerHTML = '';
    this.taskManager.tasks.forEach(task => {
      const taskElement = this.createTaskElement(task);
      this.taskListElement.appendChild(taskElement);
    });
  }

  createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;
    
    const pomodoroCount = document.createElement('span');
    pomodoroCount.className = 'pomodoro-count';
    pomodoroCount.textContent = `${task.pomodoros} 🍅`;
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = task.completed ? 'Desfazer' : 'Completar';
    toggleButton.onclick = () => {
      this.taskManager.toggleTask(task.id);
      this.render();
    };
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'danger';
    deleteButton.textContent = 'Excluir';
    deleteButton.onclick = () => {
      this.taskManager.deleteTask(task.id);
      this.render();
    };
    
    taskElement.append(title, pomodoroCount, toggleButton, deleteButton);
    return taskElement;
  }
}