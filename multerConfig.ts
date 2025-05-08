import multer from "multer";
import path from "path";

// Diretório de armazenamento das imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/establishments")); // ✅ Diretório correto
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Instância do `multer`
export const upload = multer({ storage: storage });

// ✅ Servir imagens publicamente
import express from "express";
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
