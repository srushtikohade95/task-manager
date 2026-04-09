// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const errorContainer = document.getElementById('error-container');
const loadingIndicator = document.getElementById('loading');

// Application State
const State = {
    tasks: [],
    currentFilter: 'all', // 'all', 'active', 'completed'
};

// --- UI Feedback & Utilities ---

const showError = (message) => {
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
    setTimeout(() => {
        errorContainer.classList.add('hidden');
    }, 4000);
};

const toggleLoading = (show) => {
    if (show) {
        loadingIndicator.classList.remove('hidden');
        taskList.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        taskList.classList.remove('hidden');
    }
};

const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};

// --- Event Handlers & API Integration ---

const loadTasks = async () => {
    try {
        toggleLoading(true);
        State.tasks = await TaskAPI.fetchAll();
        render();
    } catch (error) {
        showError('Could not connect to server. Ensure backend is running.');
        console.error(error);
    } finally {
        toggleLoading(false);
    }
};

const handleAddTask = async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return showError('Task title cannot be empty.');

    try {
        taskInput.disabled = true;
        const newTask = await TaskAPI.create(title);
        State.tasks.push(newTask);
        taskInput.value = '';
        render();
    } catch (error) {
        showError(error.message);
    } finally {
        taskInput.disabled = false;
        taskInput.focus();
    }
};

const handleToggleStatus = async (id, completed) => {
    try {
        await TaskAPI.updateStatus(id, completed);
        const task = State.tasks.find(t => t.id === id);
        if (task) task.completed = completed;
        render();
    } catch (error) {
        showError(error.message);
        render(); // Revert UI check state on error
    }
};

const handleEditTitle = async (id, newTitle) => {
    try {
        await TaskAPI.updateTitle(id, newTitle);
        const task = State.tasks.find(t => t.id === id);
        if (task) task.title = newTitle;
    } catch (error) {
        showError(error.message);
    } finally {
        render();
    }
};

const handleDelete = async (id) => {
    try {
        await TaskAPI.delete(id);
        State.tasks = State.tasks.filter(t => t.id !== id);
        render();
    } catch (error) {
        showError(error.message);
    }
};

const handleFilterChange = (btn) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    State.currentFilter = btn.dataset.filter;
    render();
};

// --- Rendering Logic ---

const render = () => {
    taskList.innerHTML = '';
    
    let filteredTasks = State.tasks;
    if (State.currentFilter === 'active') {
        filteredTasks = State.tasks.filter(t => !t.completed);
    } else if (State.currentFilter === 'completed') {
        filteredTasks = State.tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<li style="text-align:center; color:var(--text-muted); padding: 1rem;">No tasks found.</li>`;
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-title ${task.completed ? 'completed' : ''}">${escapeHTML(task.title)}</span>
            <div class="task-actions">
                <button class="task-btn btn-edit" title="Edit">✎</button>
                <button class="task-btn btn-delete" title="Delete">✕</button>
            </div>
        `;

        // Event: Toggle check
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', (e) => handleToggleStatus(task.id, e.target.checked));

        // Event: Delete
        const deleteBtn = li.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => handleDelete(task.id));

        // Event: Edit (Inline editing setup)
        const editBtn = li.querySelector('.btn-edit');
        const titleSpan = li.querySelector('.task-title');
        
        editBtn.addEventListener('click', () => {
            const currentTitle = task.title;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'task-edit-input';
            input.value = currentTitle;
            
            titleSpan.replaceWith(input);
            input.focus();

            const saveEdit = () => {
                const newTitle = input.value.trim();
                if (newTitle && newTitle !== currentTitle) {
                    handleEditTitle(task.id, newTitle);
                } else {
                    render(); // Revert if empty or unchanged
                }
            };

            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                } else if (e.key === 'Escape') {
                    render(); // Cancel edit
                }
            });
        });

        taskList.appendChild(li);
    });
};

// --- Initialization ---

const init = () => {
    taskForm.addEventListener('submit', handleAddTask);
    filterBtns.forEach(btn => btn.addEventListener('click', () => handleFilterChange(btn)));
    loadTasks();
};

// Start App
init();
