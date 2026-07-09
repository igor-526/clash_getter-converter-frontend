# Clash Getter Frontend

Frontend для `Clash Converter`: одностраничный интерфейс, который принимает RAW VPN-ссылку или полный WireGuard config, отправляет данные в backend `clash_getter` и показывает результат в формате YAML или JSON.

## Возможности

- Ввод имени конфигурации.
- Выбор формата результата: `YAML` или `JSON`.
- Ввод RAW VPN-ссылок VLESS/Hysteria2 или многострочного WireGuard config.
- Клиентская валидация через Zod перед отправкой запроса.
- Вызов backend endpoint `POST /api/v1/convert`.
- Редактируемое поле результата.
- Копирование результата через Clipboard API.
- Адаптивный layout: две колонки на desktop, output под input на mobile.
- На mobile после успешной генерации интерфейс переводит пользователя к output.

## Стек

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zod
- Vitest + Testing Library

## Backend

Frontend ожидает backend `clash_getter`, который предоставляет:

- `GET /api/v1/health`
- `POST /api/v1/convert`

Контракт конвертации:

```ts
type ConvertInDto = {
  name?: string | null;
  out_type?: "yaml" | "json" | null;
  raw: string;
};

type ConvertOutDto = {
  protocol: string;
  result: string;
};
```

Локально backend используется через:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:32768
```

Backend CORS должен разрешать origin frontend:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Запуск

Установить зависимости:

```bash
npm install
```

Проверить `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:32768
```

Запустить frontend:

```bash
npm run dev
```

Открыть:

```text
http://localhost:3000
```

## Скрипты

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # production server после build
npm run lint       # ESLint
npm run test       # Vitest single run
npm run test:watch # Vitest watch mode
```

## Структура

```text
src/
├── api/
│   ├── client.ts
│   └── convert.ts
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── features/
│   └── clashConverter/
│       ├── hooks/
│       ├── services/
│       ├── ui/
│       └── validators/
└── types/
    └── api/
        └── convert.ts
```

Основная цепочка ответственности:

```text
src/app/page.tsx
-> src/features/clashConverter/ui
-> src/features/clashConverter/hooks
-> src/features/clashConverter/services
-> src/api
-> backend
```

`src/app/page.tsx` не содержит бизнес-логики. DTO находятся в `src/types`, HTTP boundary в `src/api`, сценарная логика фичи в `src/features/clashConverter`.

## Проверка

Базовая проверка перед сдачей изменений:

```bash
npm run test
npm run lint
npm run build
```

Ручной smoke test:

1. Запустить backend на `http://localhost:32768`.
2. Запустить frontend на `http://localhost:3000`.
3. Вставить VLESS или Hysteria2 link и сгенерировать YAML.
4. Вставить WireGuard config и сгенерировать JSON.
5. Проверить, что output появился, редактируется и копируется.

## OpenSpec

Актуальная спецификация frontend-сценария находится в:

```text
openspec/specs/clash-converter-ui/spec.md
```
