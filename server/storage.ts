import { users, workOrders, chatMessages, type User, type InsertUser, type WorkOrder, type InsertWorkOrder, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;

  // Work order methods
  createWorkOrder(order: InsertWorkOrder & { userId: number; price: number }): Promise<WorkOrder>;
  getWorkOrdersByUserId(userId: number): Promise<WorkOrder[]>;
  getWorkOrderById(id: number): Promise<WorkOrder | undefined>;
  updateWorkOrderStatus(id: number, status: string): Promise<void>;

  // Chat methods
  getChatMessagesByOrderId(orderId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        name: insertUser.name,
        email: insertUser.email,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async createWorkOrder(order: InsertWorkOrder & { userId: number; price: number }): Promise<WorkOrder> {
    const [workOrder] = await db
      .insert(workOrders)
      .values({
        type: order.type,
        theme: order.theme,
        customOutline: order.customOutline ?? false,
        outline: order.outline || null,
        userId: order.userId,
        price: order.price,
        status: 'pending',
      })
      .returning();
    return workOrder;
  }

  async getWorkOrdersByUserId(userId: number): Promise<WorkOrder[]> {
    return await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.userId, userId))
      .orderBy(workOrders.createdAt);
  }

  async getWorkOrderById(id: number): Promise<WorkOrder | undefined> {
    const [order] = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return order || undefined;
  }

  async updateWorkOrderStatus(id: number, status: string): Promise<void> {
    await db
      .update(workOrders)
      .set({ 
        status,
        completedAt: status === 'completed' ? new Date() : null
      })
      .where(eq(workOrders.id, id));
  }

  async getChatMessagesByOrderId(orderId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.orderId, orderId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workOrders: Map<number, WorkOrder>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentWorkOrderId: number;
  private currentChatMessageId: number;

  constructor() {
    this.users = new Map();
    this.workOrders = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentWorkOrderId = 1;
    this.currentChatMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: this.currentUserId++,
      name: insertUser.name,
      email: insertUser.email,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async createWorkOrder(order: InsertWorkOrder & { userId: number; price: number }): Promise<WorkOrder> {
    const workOrder: WorkOrder = {
      id: this.currentWorkOrderId++,
      type: order.type,
      theme: order.theme,
      customOutline: order.customOutline ?? false,
      outline: order.outline || null,
      userId: order.userId,
      price: order.price,
      status: 'pending',
      createdAt: new Date(),
      completedAt: null
    };
    this.workOrders.set(workOrder.id, workOrder);
    return workOrder;
  }

  async getWorkOrdersByUserId(userId: number): Promise<WorkOrder[]> {
    return Array.from(this.workOrders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getWorkOrderById(id: number): Promise<WorkOrder | undefined> {
    return this.workOrders.get(id);
  }

  async updateWorkOrderStatus(id: number, status: string): Promise<void> {
    const order = this.workOrders.get(id);
    if (order) {
      order.status = status;
      if (status === 'completed') {
        order.completedAt = new Date();
      }
    }
  }

  async getChatMessagesByOrderId(orderId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.orderId === orderId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: this.currentChatMessageId++,
      ...message,
      createdAt: new Date()
    };
    this.chatMessages.set(chatMessage.id, chatMessage);
    return chatMessage;
  }
}

// Use database storage in production, memory storage in development
export const storage = process.env.NODE_ENV === 'production' 
  ? new DatabaseStorage() 
  : new MemStorage();
