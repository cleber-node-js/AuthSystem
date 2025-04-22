"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EstablishmentController_1 = require("../controllers/EstablishmentController");
const upload_1 = require("../middlewares/upload"); // Middleware para upload de imagem
const authMiddleware_1 = require("../middlewares/authMiddleware");
const establishmentController = new EstablishmentController_1.EstablishmentController();
const router = (0, express_1.Router)();
// ✅ Criar estabelecimento — apenas usuário autenticado, com upload de imagem
router.post('/establishments', authMiddleware_1.authMiddleware, upload_1.upload.single('image'), async (req, res, next) => {
    try {
        await establishmentController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ✅ Atualizar estabelecimento — só dono autenticado
router.put('/establishments/:id', authMiddleware_1.authMiddleware, authMiddleware_1.authenticateOwner, async (req, res, next) => {
    try {
        await establishmentController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ✅ Deletar estabelecimento — só dono autenticado
router.delete('/establishments/:id', authMiddleware_1.authMiddleware, authMiddleware_1.authenticateOwner, async (req, res, next) => {
    try {
        await establishmentController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 📥 Buscar estabelecimento por ID — público
router.get('/establishments/:id', async (req, res, next) => {
    try {
        await establishmentController.getById(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 📋 Listar todos os estabelecimentos — público
router.get('/establishments', async (req, res, next) => {
    try {
        await establishmentController.getAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 🎤 Buscar artistas associados — público
router.get('/establishments/:id/artists', async (req, res, next) => {
    try {
        await establishmentController.getArtistsByEstablishment(req, res);
    }
    catch (error) {
        next(error);
    }
});
// ✅ Atualizar status de artista vinculado — só dono autenticado
router.patch('/establishments/:establishmentId/artists/:artistId/status', authMiddleware_1.authMiddleware, async (req, res, next) => {
    console.log(`🔍 ID do estabelecimento recebido:`, req.params.establishmentId);
    console.log(`🔍 ID do artista recebido:`, req.params.artistId);
    console.log(`🔍 Body recebido:`, req.body);
    try {
        await establishmentController.updateArtistStatus(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=establishment.routes.js.map