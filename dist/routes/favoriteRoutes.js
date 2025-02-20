"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FavoriteController_1 = require("../controllers/FavoriteController");
const router = (0, express_1.Router)();
const favoriteController = new FavoriteController_1.FavoriteController();
// Ajuste das Rotas com Funções Anônimas
router.post('/', (req, res, next) => {
    favoriteController.addFavorite(req, res).catch(next);
});
router.get('/user/:userId', (req, res, next) => {
    favoriteController.getUserFavorites(req, res).catch(next);
});
router.get('/check', (req, res, next) => {
    favoriteController.checkFavorite(req, res).catch(next);
});
router.get('/', (req, res, next) => {
    favoriteController.getAllFavorites(req, res).catch(next);
});
router.delete('/:id', (req, res, next) => {
    favoriteController.removeFavorite(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=favoriteRoutes.js.map