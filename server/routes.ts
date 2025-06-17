import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { verifyToken, generateToken, type AuthRequest } from "./middleware/auth";
import { loginSchema, registerSchema, workOrderSchema, chatMessageSchema } from "@shared/schema";
import { z } from "zod";

const WORK_PRICES = {
  referat: 499,
  project: 499,
  coursework: 759,
  bachelor: 899,
  specialist: 999,
  master: 1299
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Пользователь с таким email уже существует" });
      }

      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password
      });

      const token = generateToken(user.id);
      
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ message: "Неверный email или пароль" });
      }

      const token = generateToken(user.id);
      
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  // Protected routes
  app.get("/api/auth/me", verifyToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.userId!);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  // Work orders
  app.post("/api/work-orders", verifyToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = workOrderSchema.parse(req.body);
      
      const price = WORK_PRICES[validatedData.type as keyof typeof WORK_PRICES];
      if (!price) {
        return res.status(400).json({ message: "Неверный тип работы" });
      }

      const order = await storage.createWorkOrder({
        ...validatedData,
        userId: req.userId!,
        price
      });

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  app.get("/api/work-orders", verifyToken, async (req: AuthRequest, res) => {
    try {
      const orders = await storage.getWorkOrdersByUserId(req.userId!);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  app.get("/api/work-orders/:id", verifyToken, async (req: AuthRequest, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getWorkOrderById(orderId);
      
      if (!order || order.userId !== req.userId!) {
        return res.status(404).json({ message: "Заказ не найден" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  // Chat messages
  app.get("/api/work-orders/:id/messages", verifyToken, async (req: AuthRequest, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getWorkOrderById(orderId);
      
      if (!order || order.userId !== req.userId!) {
        return res.status(404).json({ message: "Заказ не найден" });
      }

      const messages = await storage.getChatMessagesByOrderId(orderId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  app.post("/api/work-orders/:id/messages", verifyToken, async (req: AuthRequest, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getWorkOrderById(orderId);
      
      if (!order || order.userId !== req.userId!) {
        return res.status(404).json({ message: "Заказ не найден" });
      }

      const validatedData = chatMessageSchema.parse({
        ...req.body,
        orderId,
        fromUser: true
      });

      const message = await storage.createChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  // User stats
  app.get("/api/stats", verifyToken, async (req: AuthRequest, res) => {
    try {
      const orders = await storage.getWorkOrdersByUserId(req.userId!);
      
      const stats = {
        totalOrders: orders.length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'in_progress').length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
