"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassificationController_1 = require("../controllers/ClassificationController");
const router = (0, express_1.Router)();
const classificationController = new ClassificationController_1.ClassificationController();
// Rotas ajustadas com funções anônimas e middlewares
router.post('/', (req, res, next) => {
    classificationController.createClassification(req, res).catch(next);
});
router.get('/', (req, res, next) => {
    classificationController.getAllClassifications(req, res).catch(next);
});
router.get('/:id', (req, res, next) => {
    classificationController.getClassificationById(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    classificationController.updateClassification(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    classificationController.deleteClassification(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=classificationRoutes.js.map