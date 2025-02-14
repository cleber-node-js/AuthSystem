// src/routes/userRoleRoutes.ts

import express from 'express';
import { UserRoleController } from '../controllers/UserRoleController';

const router = express.Router();
const userRoleController = new UserRoleController();

// Rotas
router.post('/', userRoleController.createUserRole);
router.get('/', userRoleController.getAllUserRoles);
router.get('/:id', userRoleController.getUserRoleById);
router.put('/:id', userRoleController.updateUserRole);
router.delete('/:id', userRoleController.deleteUserRole);

export default router;