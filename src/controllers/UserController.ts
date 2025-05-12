import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Interface personalizada para representar um usuário autenticado
 */
export interface CustomUser {
  id: number;
  email: string;
  role: string; // ✅ Garantindo que role está sempre presente
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

export class UserController {
  /**
   * 🔹 Registro de cliente
   */
  async register(req: Request, res: Response) {
    const { email, password, name, userType, additionalData } = req.body;

    try {
      const user = await userService.registerUser(email, password, name, userType, additionalData);
      res.status(201).json(user);
    } catch (error) {
      console.error("❌ Erro ao registrar usuário:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Erro desconhecido.' });
    }
  }

  /**
   * 🔹 Login do cliente e geração do token JWT
   */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await userService.authenticateUser(email, password);
      if (user === null || user === undefined) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ user_id: user.id, role: user.profileType }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  /**
   * 🔹 Middleware de autenticação
   */
  authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token de autenticação é necessário." });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as CustomUser;

      req.user = decoded;
      next();
    } catch (error) {
      console.error("❌ Erro na autenticação:", error);
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }
  }

  /**
   * 🔹 Criar um usuário autenticado (Apenas CLIENTES podem criar novos usuários)
   */
  async createUser(req: Request, res: Response) {
    if (!req.user || req.user.role !== "client") {
      return res.status(403).json({ message: "Apenas clientes autenticados podem criar usuários." });
    }

    try {
      const { email, password, name, userType } = req.body;
      const user = await userService.registerUser(email, password, name, userType);
      res.status(201).json(user);
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      res.status(400).json({ message: "Erro ao criar usuário." });
    }
  }

  /**
   * 🔹 Buscar usuário por ID
   */
  async getUser(req: Request, res: Response) {
    try {
      const user_id = Number(req.params.id);
      const user = await userService.getUserById(user_id);

      if (user === null || user === undefined) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  /**
   * 🔹 Retornar todos os usuários
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  /**
   * 🔹 Atualizar um usuário
   */
  async updateUser(req: Request, res: Response) {

    if (!req.user_id) {
      return res.status(401).json({ message: "Token de autenticação é necessário." });
    }

    try {
      const user_id = Number(req.params.id);
      const data = req.body;
      const updatedUser = await userService.updateUser(user_id, data);
      if (updatedUser === null || updatedUser === undefined) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      res.status(400).json({ message: "Erro ao atualizar usuário." });
    }
  }

  /**
   * 🔹 Soft delete de usuário
   */
  async deleteUser(req: Request, res: Response) {
    // console.log(req.user_id)
    if (!req.user_id) {
      return res.status(401).json({ message: "Token de autenticação é necessário." });
    }

    try {
      const user_id = Number(req.params.id);
      const deletedUser = await userService.softDeleteUser(user_id);
      res.status(200).json({ message: "Usuário excluído com sucesso.", user: deletedUser });
    } catch (error) {
      console.error("❌ Erro ao excluir usuário:", error);
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}
