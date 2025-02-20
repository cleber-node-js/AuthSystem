"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// Ajuste das Rotas com Funções Anônimas
router.post('/users/register', (req, res, next) => {
    userController.register(req, res).catch(next);
});
router.get('/users', (req, res, next) => {
    userController.getAllUsers(req, res).catch(next);
});
router.get('/users/:id', (req, res, next) => {
    userController.getUser(req, res).catch(next);
});
router.put('/users/:id', (req, res, next) => {
    userController.updateUser(req, res).catch(next);
});
router.delete('/users/:id', (req, res, next) => {
    userController.deleteUser(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map