import { Request } from "express";
import { Multer } from "multer"; 

// Definindo a interface User
interface User {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    // Adicionando campos ao Request
    interface Request {
      user_id?: string;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined;
      params: {
        id: string;
      };
      user?: User; // Definindo o tipo para 'user'
    }

    // Adicionando campos ao Response
    interface Response {
      user?: User; // Definindo o tipo para 'user'
    }
  }
}

export {};
