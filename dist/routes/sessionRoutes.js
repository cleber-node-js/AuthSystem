"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const router = (0, express_1.Router)();
const sessionController = new SessionController_1.SessionController();
// Ajuste das Rotas com Funções Anônimas
router.post('/', (req, res, next) => {
    sessionController.createSession(req, res).catch(next);
});
router.get('/', (req, res, next) => {
    sessionController.getAllSessions(req, res).catch(next);
});
router.get('/:id', (req, res, next) => {
    sessionController.getSessionById(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    sessionController.updateSession(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    sessionController.deleteSession(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=sessionRoutes.js.map