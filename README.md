# Deeplom Bot - Клон сайта для генерации дипломных работ

Полный клон сайта deeplom.ru с JWT авторизацией и личным кабинетом пользователя.

## Возможности

- 🏠 Полная главная страница с героическим блоком, функциями и таблицей цен
- 📝 Форма генерации работ со всеми типами (реферат, курсовая, диплом и т.д.)
- 🔐 Система регистрации и входа с JWT аутентификацией
- 👤 Личный кабинет с управлением заказами и чатом поддержки
- 🇷🇺 Русскоязычный интерфейс, соответствующий оригинальному дизайну
- 📱 Адаптивный дизайн для всех устройств

## Архитектура

Проект разделен на два контейнера:

- **Frontend**: React + Vite + TailwindCSS (Nginx)
- **Backend**: Express.js + TypeScript + JWT Auth

## Быстрый старт

### Использование Docker (рекомендуется)

1. Клонируйте репозиторий
2. Запустите скрипт развертывания:

```bash
chmod +x deploy.sh
./deploy.sh
```

Приложение будет доступно по адресу:
- Frontend: http://localhost
- Backend API: http://localhost:5000

### Ручная настройка

1. Установите зависимости:
```bash
npm install
```

2. Запустите в режиме разработки:
```bash
npm run dev
```

## Структура проекта

```
├── client/                 # Frontend React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   └── lib/           # Утилиты и настройки
├── server/                 # Backend Express сервер
│   ├── middleware/         # Middleware для аутентификации
│   ├── routes.ts          # API маршруты
│   ├── storage.ts         # In-memory хранилище данных
│   └── production.ts      # Production сервер
├── shared/                 # Общие типы и схемы
│   └── schema.ts          # Zod схемы и типы
├── docker-compose.yml     # Docker Compose конфигурация
├── Dockerfile.client      # Frontend Docker контейнер
├── Dockerfile.server      # Backend Docker контейнер
└── deploy.sh             # Скрипт быстрого развертывания
```

## API Эндпоинты

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получить текущего пользователя

### Заказы
- `POST /api/work-orders` - Создать заказ
- `GET /api/work-orders` - Получить заказы пользователя
- `GET /api/work-orders/:id` - Получить конкретный заказ

### Чат
- `GET /api/work-orders/:id/messages` - Получить сообщения чата
- `POST /api/work-orders/:id/messages` - Отправить сообщение

### Статистика
- `GET /api/stats` - Получить статистику пользователя

## Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost
PORT=5000
NODE_ENV=production
```

## Docker команды

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs frontend
docker-compose logs backend

# Остановка
docker-compose down

# Пересборка
docker-compose build
```

## Цены на услуги

| Тип работы | Цена |
|-----------|------|
| Реферат | 499 руб. |
| Проект | 499 руб. |
| Курсовая работа | 759 руб. |
| Дипломная работа бакалавра | 899 руб. |
| Дипломная работа специалиста | 999 руб. |
| Магистерская диссертация | 1299 руб. |

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Wouter (маршрутизация)
- TanStack Query
- Shadcn/ui
- Lucide React (иконки)

### Backend
- Node.js
- Express.js
- TypeScript
- JWT для аутентификации
- Bcrypt для хеширования паролей
- Zod для валидации
- CORS

### DevOps
- Docker & Docker Compose
- Nginx
- Multi-stage builds

## Разработка

Для разработки используйте команду:

```bash
npm run dev
```

Это запустит Vite dev сервер с hot reload и Express backend.

## Лицензия

Проект создан для демонстрационных целей как клон deeplom.ru.