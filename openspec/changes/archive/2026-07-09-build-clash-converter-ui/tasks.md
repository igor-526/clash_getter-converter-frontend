## 1. Подготовка проекта

- [x] 1.1 Повторно получить `http://localhost:32768/openapi.json` и подтвердить контракт `POST /api/v1/convert`, сверив backend-правило `out_type` только `yaml` или `json`.
- [x] 1.2 Проверить текущую структуру Next.js проекта и определить точный набор файлов, которые нужно перенести из корневого `app/` в `src/app`.
- [x] 1.3 Добавить недостающие зависимости для клиентской валидации и тестирования, включая `zod` и выбранные test tools при необходимости.
- [x] 1.4 Настроить обязательный backend base URL через `.env`, не хардкодя URL и не добавляя fallback в компонентах, hooks или services.

## 2. Архитектурная структура

- [x] 2.1 Создать `src/app` и перенести туда layout, metadata, global styles и основную страницу.
- [x] 2.2 Удалить или мигрировать корневой `app/`, чтобы в проекте не осталось двух конкурирующих App Router roots.
- [x] 2.3 Создать DTO-типы `ConvertInDto` и `ConvertOutDto` в `src/types/api/convert.ts`.
- [x] 2.4 Создать HTTP client boundary в `src/api/client.ts`.
- [x] 2.5 Создать API-функцию конвертации в `src/api/convert.ts`.
- [x] 2.6 Создать feature-структуру `src/features/clashConverter/{hooks,services,ui,validators}`.

## 3. Бизнес-сценарий конвертации

- [x] 3.1 Реализовать Zod-схему формы с обязательным непустым `raw`, опциональным `name` и строгим форматом `yaml` или `json`.
- [x] 3.2 Реализовать feature service, который вызывает `src/api/convert` и возвращает `ConvertOutDto`.
- [x] 3.3 Реализовать feature hook для состояния формы, загрузки, ошибок, результата, ручного редактирования output и submit handler.
- [x] 3.4 Обработать ошибки backend и сети так, чтобы предыдущий output не очищался при неуспешном запросе.
- [x] 3.5 Реализовать копирование текущего output через Clipboard API с состояниями успеха и ошибки.

## 4. Интерфейс

- [x] 4.1 Реализовать header `Clash Converter` с выравниванием слева на desktop и по центру на mobile.
- [x] 4.2 Реализовать desktop layout с input-блоком слева и output-блоком справа.
- [x] 4.3 Реализовать mobile layout, где output-блок расположен под input-блоком.
- [x] 4.4 Реализовать поле имени конфигурации, radio/segmented control формата с default `YAML`, textarea для RAW input и кнопку генерации.
- [x] 4.5 Реализовать редактируемую output textarea и кнопку копирования.
- [x] 4.6 После успешной генерации на mobile прокручивать пользователя к output textarea и кнопке копирования.
- [x] 4.7 Стилизовать экран в минималистичном Material/Liquid-подобном стиле без вложенных cards и без нарушения responsive constraints.

## 5. Проверка качества

- [x] 5.1 Добавить unit-тесты для валидации формы и mapping submit payload.
- [x] 5.2 Добавить тесты для hook/service или UI-сценария успешной генерации, ошибки backend и копирования output.
- [x] 5.3 Ручно проверить VLESS, Hysteria2 и WireGuard примеры из `/home/igor/projects/clash_getter/docs/vpn_links_examples.md` через frontend и backend.
- [x] 5.4 Проверить mobile-сценарий: после генерации пользователь попадает к готовому output и copy action.
- [x] 5.5 Запустить `npm run lint`.
- [x] 5.6 Запустить production build или доступную проверку Next.js сборки.
