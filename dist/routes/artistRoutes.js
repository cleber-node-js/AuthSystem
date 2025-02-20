"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ArtistController_1 = require("../controllers/ArtistController");
const router = (0, express_1.Router)();
const artistController = new ArtistController_1.ArtistController();
// Ajuste das Rotas com Funções Anônimas
router.post('/artists', (req, res) => {
    artistController.create(req, res);
});
router.get('/artists/:id', (req, res) => {
    artistController.getArtist(req, res);
});
router.get('/artists', (req, res) => {
    artistController.getAll(req, res);
});
router.put('/artists/:id', (req, res) => {
    artistController.update(req, res);
});
router.delete('/artists/:id', (req, res) => {
    artistController.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=artistRoutes.js.map