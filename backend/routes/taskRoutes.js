const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define API routes and map them to controller methods
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTaskStatus);
router.patch('/:id/title', taskController.updateTaskTitle);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
