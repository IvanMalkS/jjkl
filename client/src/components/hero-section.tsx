import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToGeneration = () => {
    const element = document.getElementById('generation');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Deeplom Bot
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
          Сервис для генерации дипломных и курсовых работ при помощи нейросетей
        </h2>
        <Button 
          size="lg" 
          className="px-8 py-4 text-lg font-semibold"
          onClick={scrollToGeneration}
        >
          Попробовать бесплатно
        </Button>
      </div>
    </section>
  );
}
