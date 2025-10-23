import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { listUsers, createUser, updateUser, deleteUser, listUserTasks, createUserTask } from '../controllers/adminController.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/users/:id/tasks', listUserTasks);
router.post('/users/:id/tasks', createUserTask);

export default router;
