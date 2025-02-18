"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.post('/users/register', userController.register.bind(userController));
router.get('/users', userController.getAllUsers.bind(userController));
router.get('/users/:id', userController.getUser.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map