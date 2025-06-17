export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Контакты</h3>
            <p className="text-gray-600 mb-2">2023-2025, Deeplom Ru</p>
            <p className="text-gray-600">
              Адрес для связи (служба поддержки):{' '}
              <a href="mailto:mail@deeplom.ru" className="text-primary hover:underline">
                mail@deeplom.ru
              </a>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Услуги</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-primary">Нейросеть для рефератов</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">Нейросеть для курсовых работ</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">Нейросеть для проектов</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-primary">Цены</a></li>
              <li><a href="#" className="hover:text-primary">Партнёрская программа</a></li>
              <li><a href="#" className="hover:text-primary">Публичная оферта</a></li>
              <li><a href="#" className="hover:text-primary">Политика обработки персональных данных</a></li>
              <li><a href="#" className="hover:text-primary">Политика возвратов</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p className="mb-4">ИП Кудряшов Иван Сергеевич, ИНН 720210493019</p>
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Система быстрых платежей
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
