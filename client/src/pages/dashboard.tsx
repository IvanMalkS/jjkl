import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, Clock, CheckCircle, BarChart3, MessageCircle, Settings, Download, Send } from 'lucide-react';
import { authManager } from '@/lib/auth';
import type { WorkOrder, ChatMessage } from '@shared/schema';

interface UserStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authManager.isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const { data: stats } = useQuery<UserStats>({
    queryKey: ['/api/stats'],
    enabled: authManager.isAuthenticated(),
  });

  const { data: orders = [] } = useQuery<WorkOrder[]>({
    queryKey: ['/api/work-orders'],
    enabled: authManager.isAuthenticated(),
  });

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/work-orders', selectedOrderId, 'messages'],
    enabled: !!selectedOrderId,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Выполнено</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">В работе</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Ожидает</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getWorkTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      referat: 'Реферат',
      project: 'Проект',
      coursework: 'Курсовая работа',
      bachelor: 'Дипломная работа бакалавра',
      specialist: 'Дипломная работа специалиста',
      master: 'Магистерская диссертация'
    };
    return types[type] || type;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrderId) return;

    try {
      const token = authManager.getToken();
      const response = await fetch(`/api/work-orders/${selectedOrderId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        window.location.reload();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!authManager.isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Личный кабинет</h3>
                <nav className="space-y-2">
                  <Link href="/dashboard">
                    <a className="flex items-center px-3 py-2 text-sm text-primary bg-blue-50 rounded-lg">
                      <BarChart3 className="mr-3 h-4 w-4" />
                      Обзор
                    </a>
                  </Link>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <FileText className="mr-3 h-4 w-4" />
                    Мои заказы
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <MessageCircle className="mr-3 h-4 w-4" />
                    Чат с поддержкой
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <Settings className="mr-3 h-4 w-4" />
                    Настройки
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Всего заказов</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats?.totalOrders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Выполнено</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats?.completedOrders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">В работе</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats?.pendingOrders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders and Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Последние заказы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Заказов пока нет</p>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{getWorkTypeLabel(order.type)}</p>
                            <p className="text-sm text-gray-600">{order.theme}</p>
                            <p className="text-xs text-gray-500">ID заказа: #{order.id}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(order.status)}
                            {order.status === 'completed' ? (
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Chat */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Чат {selectedOrderId ? `по заказу #${selectedOrderId}` : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrderId ? (
                    <div className="space-y-4">
                      <ScrollArea className="h-64 w-full border rounded p-4">
                        {messages.length === 0 ? (
                          <p className="text-gray-500 text-center">Сообщений пока нет</p>
                        ) : (
                          <div className="space-y-3">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.fromUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs px-3 py-2 rounded-lg ${
                                    message.fromUser
                                      ? 'bg-primary text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className="text-xs opacity-75 mt-1">
                                    {new Date(message.createdAt!).toLocaleTimeString('ru-RU')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                      
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Введите сообщение..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Выберите заказ для просмотра чата
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
