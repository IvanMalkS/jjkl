import { users, workOrders, chatMessages, type User, type InsertUser, type WorkOrder, type InsertWorkOrder, type ChatMessage, type InsertChatMessage } from "@shared/schema";
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

    // Add some mock data
    this.seedData();
  }

  private async seedData() {
    // Create a test user
    const testUser = await this.createUser({
      name: 'Иван Петров',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create some mock work orders
    const mockOrders = [
      {
        userId: testUser.id,
        type: 'bachelor',
        theme: 'Применение нейросетей в образовании',
        status: 'completed',
        customOutline: false,
        outline: null,
        price: 899,
        completedAt: new Date()
      },
      {
        userId: testUser.id,
        type: 'coursework',
        theme: 'Анализ данных с помощью машинного обучения',
        status: 'in_progress',
        customOutline: false,
        outline: null,
        price: 759,
        completedAt: null
      }
    ];

    for (const order of mockOrders) {
      const workOrder: WorkOrder = {
        id: this.currentWorkOrderId++,
        ...order,
        createdAt: new Date()
      };
      this.workOrders.set(workOrder.id, workOrder);
    }

    // Add some mock chat messages
    this.createChatMessage({
      orderId: 2,
      fromUser: true,
      message: 'Здравствуйте! Когда будет готова моя работа?'
    });

    this.createChatMessage({
      orderId: 2,
      fromUser: false,
      message: 'Добрый день! Ваша работа будет готова в течение 2-3 часов.'
    });
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
      ...order,
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

export const storage = new MemStorage();
