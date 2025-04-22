import multer from 'multer';
import path from 'path';

// Configuração do storage para o multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extensão do arquivo
    const filename = `${Date.now()}${ext}`; // Nome único para cada arquivo
    cb(null, filename);
  }
});

// Verificar se o arquivo é uma imagem
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens JPG, JPEG ou PNG são permitidas.'));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
});
