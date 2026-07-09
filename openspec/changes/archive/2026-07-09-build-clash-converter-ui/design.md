## Context

Проект является Next.js frontend-приложением, созданным из стартового шаблона. Сейчас основные route-файлы находятся в корневой директории `app/`, но архитектурные правила проекта требуют использовать Next.js App Router через `src/app` и размещать новую логику по слоям `src/api`, `src/features`, `src/types`, `src/ui`, `src/lib`.

Backend доступен на `http://localhost:32768/`. OpenAPI подтверждает контракт:

- `GET /api/v1/health`
- `POST /api/v1/convert`
- request `ConvertInDto`: `name?: string | null`, `out_type?: string | null`, `raw: string`
- response `ConvertOutDto`: `protocol: string`, `result: string`

Проверочные запросы к `/api/v1/convert` для VLESS YAML и WireGuard JSON успешно возвращают строку результата в `result`.

## Goals / Non-Goals

**Goals:**

- Создать рабочий интерфейс конвертации RAW VPN-ссылки или WireGuard-конфига в YAML/JSON.
- Соблюсти архитектуру `page.tsx -> feature ui/container -> feature hook -> feature service -> src/api -> backend`.
- Использовать DTO-контракты в `src/types`, API boundary в `src/api`, orchestration в feature service/hook.
- Выполнить клиентскую Zod-валидацию перед отправкой формы.
- Сделать UI минималистичным, адаптивным и пригодным для длинных многострочных конфигов.
- Проверить реализацию на примерах VLESS, Hysteria2 и WireGuard из backend-документации.

**Non-Goals:**

- Не реализовывать backend-логику парсинга или рендеринга на frontend.
- Не добавлять хранение истории, авторизацию, загрузку файлов или сохранение конфигов.
- Не менять backend API и формат ответа.
- Не создавать устаревшие директории `shared`, `widgets`, `entities`.

## Decisions

### Перенести приложение в `src/app`

Новый route shell будет создан в `src/app/page.tsx`, а layout и глобальные стили будут размещены под `src/app`, чтобы дальнейшая структура соответствовала `docs/frontend_base_architecture.md`. Корневой стартовый `app/` должен быть удален или заменен так, чтобы не осталось двух конкурирующих App Router roots.

Альтернатива: оставить корневой `app/`. Это быстрее, но нарушает локальную архитектурную инструкцию и затрудняет дальнейшее развитие слоев.

### Использовать одну feature `clashConverter`

Feature будет содержать UI-контейнер, hook сценария, service и Zod-схему. Route `src/app/page.tsx` должен только рендерить feature container.

Альтернатива: реализовать все в `page.tsx`. Это допустимо для прототипа, но прямо запрещено архитектурой, потому что смешивает UI, state, API и валидацию.

### Изолировать backend contract в `src/api`

`src/api/client.ts` будет отвечать за base URL и HTTP-вызовы, `src/api/convert.ts` за `POST /api/v1/convert`. Base URL нужно читать из обязательной переменной окружения, например `NEXT_PUBLIC_API_BASE_URL`, заданной через `.env`. Если переменная не задана, frontend должен явно сообщить об ошибке конфигурации, а не использовать скрытый fallback.

Альтернатива: вызвать `fetch` прямо из hook или компонента. Это проще, но нарушает API boundary и усложняет тестирование.

### Типы API держать в `src/types`

`ConvertInDto`, `ConvertOutDto` и тип формата результата должны быть описаны в `src/types/api/convert.ts` с суффиксами `InDto` и `OutDto`.

Альтернатива: объявить типы рядом с компонентом или API-файлом. Это дешевле для одной формы, но нарушает правило проекта о DTO/domain contracts.

### UI собрать на Tailwind CSS без тяжелого UI-kit

В проекте уже есть Tailwind CSS, но нет AntD, MUI или других UI-kit зависимостей. Для минималистичного Material/Liquid-подобного интерфейса достаточно Tailwind, нативных form controls, аккуратных состояний фокуса, стеклянных панелей без вложенных card-паттернов и устойчивых размеров textarea.

Альтернатива: добавить Material UI или AntD. Это может ускорить форму, но увеличит зависимости ради одного экрана и потребует дополнительной интеграции с Next 16/React 19.

### Ограничить формат результата значениями backend

Frontend должен отправлять только `out_type` со значениями `yaml` или `json`. Значение по умолчанию в UI — `yaml`. Это соответствует backend-сервису, где `null` или отсутствующий `out_type` трактуется как YAML, а любое другое значение приводит к ошибке `Invalid output type`.

Альтернатива: оставить `out_type` свободной строкой, как в OpenAPI. Это менее строго, но переносит предсказуемую ошибку выбора формата на backend и ухудшает UX.

### Mobile scroll к результату после успешной генерации

После успешного ответа hook/UI должен обновлять output и на узком viewport переводить пользователя к секции результата через `ref.scrollIntoView`. На desktop фокус остается на двухколоночном рабочем пространстве.

Альтернатива: не делать автоматическую навигацию. Это проще, но пользовательский план явно требует перевод к готовой генерации на mobile.

## Risks / Trade-offs

- [OpenAPI contract изменится] → Перед реализацией повторно получить `/openapi.json` и синхронизировать DTO.
- [CORS или недоступный backend] → Показать понятную ошибку в UI и оставить output редактируемым; в задачах предусмотреть ручную проверку health/convert.
- [Длинный WireGuard-конфиг или YAML ломает layout] → Использовать textarea с min/max height, monospace для output и responsive constraints.
- [Clipboard API недоступен] → Обработать ошибку копирования и показать пользователю состояние ошибки.
- [Два App Router roots после переноса] → В задачах явно удалить или мигрировать корневой `app/` после создания `src/app`.

## Migration Plan

1. Установить недостающие зависимости для валидации и, при необходимости, тестов.
2. Создать структуру `src/app`, `src/api`, `src/features/clashConverter`, `src/types`.
3. Перенести layout, metadata и global CSS из корневого `app/` в `src/app`, заменить стартовую страницу рабочим интерфейсом.
4. Удалить корневую директорию `app/`, если Next.js начинает видеть два App Router roots.
5. Настроить обязательный `.env` с `NEXT_PUBLIC_API_BASE_URL` для локального backend.
6. Проверить lint/build и ручные API-сценарии.

Rollback: вернуть стартовую страницу и удалить новые `src/*` модули; backend не изменяется.
