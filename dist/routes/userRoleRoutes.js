"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoleController_1 = require("../controllers/UserRoleController");
const router = express_1.default.Router();
const userRoleController = new UserRoleController_1.UserRoleController();
// Rotas
router.post('/', userRoleController.createUserRole);
router.get('/', userRoleController.getAllUserRoles);
router.get('/:id', userRoleController.getUserRoleById);
router.put('/:id', userRoleController.updateUserRole);
router.delete('/:id', userRoleController.deleteUserRole);
exports.default = router;
//# sourceMappingURL=userRoleRoutes.js.map