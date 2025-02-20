"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userPreference_controller_1 = require("../controllers/userPreference.controller");
const router = (0, express_1.Router)();
const userPreferenceController = new userPreference_controller_1.UserPreferenceController();
// GET /users/:userId/preferences - Obter preferências de um usuário
router.get('/users/:userId/preferences', userPreferenceController.getPreferencesByUserId.bind(userPreferenceController));
// POST /users/:userId/preferences - Criar preferências de um usuário (o userId vem no corpo)
router.post('/users/:userId/preferences', userPreferenceController.createPreferences.bind(userPreferenceController));
// PUT /users/:userId/preferences - Atualizar preferências de um usuário
router.put('/users/:userId/preferences', userPreferenceController.updatePreferences.bind(userPreferenceController));
// DELETE /users/:userId/preferences - Deletar preferências de um usuário
router.delete('/users/:userId/preferences', userPreferenceController.deletePreferences.bind(userPreferenceController));
exports.default = router;
//# sourceMappingURL=userPreference.routes.js.map