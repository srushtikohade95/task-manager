const Task = require('../models/taskModel');

exports.getTasks = (req, res) => {
  try {
    const tasks = Task.getAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving tasks.' });
  }
};

exports.createTask = (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required and cannot be empty.' });
    }

    const newTask = Task.create(title);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error creating task.' });
  }
};

exports.updateTaskStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const task = Task.getById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Please provide a valid boolean completed status.' });
    }

    const updatedTask = Task.updateStatus(id, completed);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task status.' });
  }
};

exports.updateTaskTitle = (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required and cannot be empty.' });
    }

    const task = Task.getById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const updatedTask = Task.updateTitle(id, title);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task title.' });
  }
};

exports.deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    
    const wasDeleted = Task.delete(id);
    if (!wasDeleted) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting task.' });
  }
};
