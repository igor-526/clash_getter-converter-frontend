## Why

Backend уже умеет преобразовывать RAW VPN-ссылки и WireGuard-конфиги в YAML/JSON для FlClashX, но сейчас у пользователя нет простого интерфейса для ввода исходных данных, запуска генерации и копирования результата. Изменение нужно сейчас, чтобы сделать backend доступным как самостоятельный frontend-сценарий и проверить его через реальные OpenAPI-контракты.

## What Changes

- Создать минималистичный интерфейс `Clash Converter` с шапкой проекта.
- Добавить форму ввода имени конфигурации, формата результата `YAML`/`JSON` и RAW-ссылки или полного WireGuard-конфига.
- Подключить frontend к backend API на основе OpenAPI JSON, без хардкода URL в компонентах, hooks или services.
- Добавить клиентскую валидацию формы через Zod перед отправкой запроса.
- Показать результат генерации в редактируемом текстовом поле с возможностью копирования.
- Реализовать адаптивную раскладку: две колонки на desktop и последовательные блоки на mobile.
- После успешной генерации на mobile переводить пользователя к полю результата и кнопке копирования.
- Проверить сценарий на примерах из `/home/igor/projects/clash_getter/docs/vpn_links_examples.md`.

## Capabilities

### New Capabilities

- `clash-converter-ui`: пользовательский сценарий конвертации RAW VPN-ссылок и WireGuard-конфигов в YAML/JSON через frontend.

### Modified Capabilities

- Нет.

## Impact

- Frontend-приложение на Next.js App Router.
- Новые модули в `src/api`, `src/features`, `src/types`, при необходимости `src/ui` и `src/lib` согласно `docs/frontend_base_architecture.md`.
- Настройка HTTP-клиента и переменной окружения для backend base URL.
- Зависимости для формы, валидации и UI, если они отсутствуют в текущем проекте.
- Интеграционное тестирование с backend `http://localhost:32768/` и примерами VLESS, Hysteria2, WireGuard.
