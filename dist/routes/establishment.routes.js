"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EstablishmentController_1 = require("../controllers/EstablishmentController");
const establishmentController = new EstablishmentController_1.EstablishmentController();
const router = (0, express_1.Router)();
// Ajuste das Rotas com Funções Anônimas
router.post('/establishments', (req, res, next) => {
    establishmentController.create(req, res).catch(next);
});
router.get('/establishments/:id', (req, res, next) => {
    establishmentController.getById(req, res).catch(next);
});
router.get('/establishments', (req, res, next) => {
    establishmentController.getAll(req, res).catch(next);
});
router.put('/establishments/:id', (req, res, next) => {
    establishmentController.update(req, res).catch(next);
});
router.delete('/establishments/:id', (req, res, next) => {
    establishmentController.delete(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=establishment.routes.js.map