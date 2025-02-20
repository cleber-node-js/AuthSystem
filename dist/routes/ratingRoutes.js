"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RatingController_1 = require("../controllers/RatingController");
const router = (0, express_1.Router)();
const ratingController = new RatingController_1.RatingController();
// Ajuste das Rotas com Funções Anônimas
router.post('/', (req, res, next) => {
    ratingController.createRating(req, res).catch(next);
});
router.get('/', (req, res, next) => {
    ratingController.getAllRatings(req, res).catch(next);
});
router.get('/:id', (req, res, next) => {
    ratingController.getRatingById(req, res).catch(next);
});
router.put('/:id', (req, res, next) => {
    ratingController.updateRating(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    ratingController.deleteRating(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=ratingRoutes.js.map