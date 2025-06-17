import { Shield, BookOpen, Clock, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Высокий процент оригинальности',
    description: 'Работы генерируются при помощи нейросетей, что обеспечивает оригинальность получаемых текстов. Тексты не содержат плагиата.'
  },
  {
    icon: BookOpen,
    title: 'Ссылки на реальные источники',
    description: 'Сервис использует для написания работ только реальную научную литературу. Все ссылки на источники будут указаны в списке литературы в соответствии с требованиями ГОСТа.'
  },
  {
    icon: Clock,
    title: 'Быстрая генерация',
    description: 'Работы генерируются автоматически за считанные минуты, что позволяет получить нужную работу в условиях ограниченного времени.'
  },
  {
    icon: MessageSquare,
    title: 'Телеграм-бот для удобного заказа работ',
    description: (
      <>
        Вы можете сгенерировать свою работу прямо из телеграма, используя нашего{' '}
        <a href="https://t.me/DeeplomAIBot" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
          бота
        </a>
        , который всегда под рукой.
      </>
    )
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 deeplom-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
