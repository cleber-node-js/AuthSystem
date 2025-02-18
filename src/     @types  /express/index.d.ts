import { Request } from 'express';
//import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      files?: {
       // [fieldname: string]: Express.Multer.File[];
      };
      params: {
        id: string;
      };
      user?: any;  // Adicione aqui os tipos personalizados para o Request, se necessário
    }

    interface Response {
      user?: any;  // Adicione aqui os tipos personalizados para o Response, se necessário
    }
  }
}

export {};
