const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const totalCountEl = document.getElementById('totalCount');
const pendingCountEl = document.getElementById('pendingCount');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));

    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">
                    <i class="${task.completed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
                </button>
                <button class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert('Введите текст задачи!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    taskInput.value = '';
    taskInput.focus();
    saveAndRender();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveAndRender();
}

function toggleTaskCompletion(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveAndRender();
}

function updateStats() {
    const totalCount = tasks.length;
    const pendingCount = tasks.filter(task => !task.completed).length;

    totalCountEl.textContent = totalCount;
    pendingCountEl.textContent = pendingCount;
}

function clearCompletedTasks() {
    if (!confirm('Удалить все выполненные задачи?')) return;
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    const taskId = Number(taskItem.dataset.id);

    if (target.closest('.complete-btn')) {
        toggleTaskCompletion(taskId);
    } else if (target.closest('.delete-btn')) {
        deleteTask(taskId);
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        saveAndRender();
    });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

saveAndRender();
