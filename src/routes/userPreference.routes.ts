// src/routes/userPreference.routes.ts
import { Router } from 'express';
import { UserPreferenceController } from '../controllers/userPreference.controller';

const router = Router();
const userPreferenceController = new UserPreferenceController();

// GET /users/:userId/preferences - Obter preferências de um usuário
router.get('/users/:userId/preferences', userPreferenceController.getPreferencesByUserId.bind(userPreferenceController));

// POST /users/:userId/preferences - Criar preferências de um usuário (o userId vem no corpo)
router.post('/users/:userId/preferences', userPreferenceController.createPreferences.bind(userPreferenceController));

// PUT /users/:userId/preferences - Atualizar preferências de um usuário
router.put('/users/:userId/preferences', userPreferenceController.updatePreferences.bind(userPreferenceController));

// DELETE /users/:userId/preferences - Deletar preferências de um usuário
router.delete('/users/:userId/preferences', userPreferenceController.deletePreferences.bind(userPreferenceController));

export default router;