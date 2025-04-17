import multer from 'multer';

// Configuração do `multer` para armazenar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/artists'); // ✅ Diretório onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
