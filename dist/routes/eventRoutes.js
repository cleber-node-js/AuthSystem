"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EventController_1 = require("../controllers/EventController");
const router = (0, express_1.Router)();
const eventController = new EventController_1.EventController();
// Ajuste das Rotas com Funções Anônimas
router.post('/', (req, res, next) => {
    eventController.create(req, res).catch(next);
});
router.get('/', (req, res, next) => {
    eventController.getAll(req, res).catch(next);
});
router.get('/:id', (req, res, next) => {
    eventController.getById(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    eventController.update(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    eventController.delete(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map