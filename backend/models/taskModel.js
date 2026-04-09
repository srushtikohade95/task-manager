const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'tasks.json');

// In-memory array for quick access
let tasks = [];

// Initialize data from file
const init = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      tasks = JSON.parse(data);
    } catch (error) {
      console.error('Error reading tasks data file:', error);
    }
  }
};

// Persist data to file
const save = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing tasks data file:', error);
    throw new Error('Database save failure');
  }
};

init();

module.exports = {
  getAll: () => tasks,
  
  getById: (id) => tasks.find(t => t.id === id),
  
  create: (title) => {
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now()
    };
    tasks.push(newTask);
    save();
    return newTask;
  },

  updateStatus: (id, completed) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = completed;
      save();
    }
    return task;
  },

  updateTitle: (id, title) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.title = title.trim();
      save();
    }
    return task;
  },

  delete: (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      save();
      return true;
    }
    return false;
  }
};
