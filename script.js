document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks based on current filter
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        });
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = filter === 'all' ? 'No tasks yet!' : 
                                      filter === 'completed' ? 'No completed tasks!' : 'No pending tasks!';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            
            taskItem.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            
            taskList.appendChild(taskItem);
            
            // Add event listeners to the new elements
            const checkbox = taskItem.querySelector('.checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', function() {
                tasks[index].completed = this.checked;
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
            });
            
            deleteBtn.addEventListener('click', function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
            });
        });
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Add new task
    addTaskBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false
            });
            saveTasks();
            taskInput.value = '';
            renderTasks(document.querySelector('.filter-btn.active').dataset.filter);
        }
    });
    
    // Add task on Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });
    
    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
    
    // Initial render
    renderTasks('all');
});