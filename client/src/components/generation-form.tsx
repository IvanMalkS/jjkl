import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authManager } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';

const workTypes = [
  { value: 'referat', label: 'Реферат' },
  { value: 'project', label: 'Проект' },
  { value: 'coursework', label: 'Курсовая работа' },
  { value: 'bachelor', label: 'Дипломная работа бакалавра' },
  { value: 'specialist', label: 'Дипломная работа специалиста' },
  { value: 'master', label: 'Магистерская диссертация' }
];

export function GenerationForm() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [theme, setTheme] = useState('');
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [customOutline, setCustomOutline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !theme.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите тип работы и введите тему',
        variant: 'destructive',
      });
      return;
    }

    if (!authManager.isAuthenticated()) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для создания заказа',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = authManager.getToken();
      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedType,
          theme: theme,
          customOutline: customOutline,
          outline: null
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания заказа');
      }

      const order = await response.json();
      
      toast({
        title: 'Заказ создан',
        description: `Заказ #${order.id} принят в работу! Вы можете отслеживать статус в личном кабинете.`,
      });

      // Reset form
      setSelectedType('');
      setTheme('');
      setCustomOutline(false);
      setShowAdditionalSettings(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Произошла ошибка при создании заказа',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="generation" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Сгенерировать дипломную работу
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Выберите тип и тему вашей работы. Сервис сгенерирует для вас текст работы
        </p>
        
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {workTypes.map((type) => (
              <label
                key={type.value}
                className={`work-type-card flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary ${
                  selectedType === type.value ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="work_type"
                  value={type.value}
                  checked={selectedType === type.value}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{type.label}</div>
                </div>
                <div className="ml-4">
                  <div className={`work-type-indicator ${selectedType === type.value ? 'selected' : ''}`} />
                </div>
              </label>
            ))}
          </div>

          <div className="mb-6">
            <Label htmlFor="theme" className="text-sm font-medium text-gray-700 mb-2">
              Тема работы
            </Label>
            <Input
              id="theme"
              type="text"
              placeholder="Введите тему вашей работы"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3"
            />
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
              className="text-primary hover:text-secondary font-medium flex items-center"
            >
              {showAdditionalSettings ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
              Дополнительные настройки
            </button>
            
            {showAdditionalSettings && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-outline"
                    checked={customOutline}
                    onCheckedChange={(checked) => setCustomOutline(checked as boolean)}
                  />
                  <Label htmlFor="custom-outline" className="text-sm text-gray-700">
                    Использовать своё оглавление
                  </Label>
                </div>
                <button type="button" className="text-primary hover:text-secondary underline">
                  Конструктор оглавления
                </button>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 px-6 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Создание заказа...' : 'Сгенерировать работу'}
          </Button>
        </form>
      </div>
    </section>
  );
}
