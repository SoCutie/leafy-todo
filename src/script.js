document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('taskList');
  let backspaceCount = 0;
  let backspaceTimer = null;
  
  // Create first task automatically
  addNewTask();

  function addNewTask() {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    
    // Green dot
    const dot = document.createElement('div');
    dot.className = 'task-dot';
    
    // Input field
    const input = document.createElement('input');
    input.className = 'task-input';
    input.type = 'text';
    input.placeholder = 'Type a task...';
    
    // Click anywhere on line to focus
    taskDiv.addEventListener('click', (e) => {
      if (e.target !== input) {
        input.focus();
        // Move cursor to end of text
        setTimeout(() => {
          input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
      }
    });
    
    // Toggle completion when clicking on text
    input.addEventListener('click', (e) => {
      if (document.activeElement === input) {
        input.classList.toggle('completed');
        if (input.classList.contains('completed')) bounceCat();
      }
    });
    
    // New line on Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addNewTask();
        taskList.lastChild.querySelector('.task-input').focus();
      }
      
      // Double backspace to delete empty line
      if (e.key === 'Backspace' && input.value === '') {
        e.preventDefault();
        
        if (taskList.children.length > 1) {
          backspaceCount++;
          
          clearTimeout(backspaceTimer);
          backspaceTimer = setTimeout(() => {
            backspaceCount = 0;
          }, 500);
          
          if (backspaceCount === 2) {
            const previousInput = taskDiv.previousElementSibling?.querySelector('.task-input');
            taskDiv.remove();
            if (previousInput) previousInput.focus();
            backspaceCount = 0;
          }
        }
      } else {
        backspaceCount = 0;
      }
    });
    
    taskDiv.appendChild(dot);
    taskDiv.appendChild(input);
    taskList.appendChild(taskDiv);
    
    if (taskList.children.length > 1) {
      input.focus();
    }
  }

  // Bounce the green cat
  function bounceCat() {
    const cat = document.querySelector('.green_cat');
    cat.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cat.style.transform = 'scale(1)';
    }, 300);
  }
  
  // Save tasks to localStorage
  window.addEventListener('beforeunload', () => {
    const tasks = Array.from(document.querySelectorAll('.task-input')).map(input => ({
      text: input.value,
      completed: input.classList.contains('completed')
    }));
    localStorage.setItem('leafy-tasks', JSON.stringify(tasks));
  });
  
  // Load saved tasks
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('leafy-tasks')) || [];
    if (savedTasks.length > 0) {
      taskList.innerHTML = '';
      savedTasks.forEach(task => {
        addNewTask();
        const lastInput = taskList.lastChild.querySelector('.task-input');
        lastInput.value = task.text;
        if (task.completed) lastInput.classList.add('completed');
      });
    }
  }
  
  loadTasks();
});