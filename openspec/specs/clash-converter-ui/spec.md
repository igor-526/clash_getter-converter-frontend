## Purpose

Описывает frontend-сценарий `Clash Converter`: ввод RAW VPN-ссылки или WireGuard-конфига, запуск конвертации через backend API, просмотр, редактирование и копирование результата.

## Requirements

### Requirement: Страница конвертера отображает основной сценарий

Система SHALL отображать единственную страницу `Clash Converter`, на которой пользователь может ввести данные для конвертации, запустить генерацию, просмотреть сгенерированный результат, отредактировать его и скопировать.

#### Scenario: Desktop-пользователь открывает конвертер

- **WHEN** пользователь открывает приложение на desktop viewport
- **THEN** система показывает нефункциональный header с заголовком `Clash Converter`
- **AND** заголовок header выровнен слева
- **AND** основной сценарий разделен на input controls слева и generated output controls справа

#### Scenario: Mobile-пользователь открывает конвертер

- **WHEN** пользователь открывает приложение на mobile viewport
- **THEN** система показывает нефункциональный header с заголовком `Clash Converter`
- **AND** заголовок header выровнен по центру
- **AND** generated output block расположен под input block

### Requirement: Пользователь может отправить данные конвертации

Система SHALL предоставлять форму с именем конфигурации, форматом результата, RAW input и действием generate.

#### Scenario: Формат результата по умолчанию YAML

- **WHEN** форма конвертера впервые отображается
- **THEN** выбор формата результата установлен в `YAML`

#### Scenario: Пользователь вводит RAW VPN link

- **WHEN** пользователь вводит имя конфигурации, выбирает формат результата, вводит RAW VPN link и отправляет форму
- **THEN** система отправляет введенное имя, выбранный формат и raw value в backend conversion endpoint

#### Scenario: Пользователь выбирает формат результата

- **WHEN** пользователь выбирает формат результата
- **THEN** система допускает только варианты `YAML` и `JSON`
- **AND** отправляемое значение `out_type` равно `yaml` или `json`

#### Scenario: Пользователь вводит WireGuard config

- **WHEN** пользователь вводит полный многострочный WireGuard config и отправляет форму
- **THEN** система сохраняет переносы строк и отправляет полный raw value в backend conversion endpoint

#### Scenario: Пользователь отправляет невалидный input

- **WHEN** пользователь отправляет форму без непустого raw value
- **THEN** система блокирует backend request
- **AND** система показывает validation error рядом с raw input

### Requirement: Frontend использует backend conversion API

Система SHALL вызывать backend endpoint `POST /api/v1/convert` с request и response contracts, совместимыми с OpenAPI.

#### Scenario: Backend URL настроен

- **WHEN** приложение отправляет conversion request
- **THEN** backend base URL читается из environment variable
- **AND** приложение не использует hardcoded fallback backend URL

#### Scenario: Успешный conversion request

- **WHEN** пользователь отправляет валидные conversion data
- **THEN** система отправляет JSON request, соответствующий `ConvertInDto`
- **AND** система читает JSON response, соответствующий `ConvertOutDto`
- **AND** generated output field заполняется значением response `result`

#### Scenario: Backend conversion завершается ошибкой

- **WHEN** backend возвращает validation error или request failure
- **THEN** система показывает пользователю error state
- **AND** система сохраняет предыдущий generated или вручную отредактированный output без изменений

### Requirement: Пользователь может редактировать и копировать generated output

Система SHALL показывать generated output в редактируемом text field и предоставлять copy action.

#### Scenario: Generated output появляется

- **WHEN** conversion request завершается успешно
- **THEN** output text field содержит generated result
- **AND** пользователь может вручную редактировать output text

#### Scenario: Пользователь копирует output

- **WHEN** output text field содержит текст и пользователь активирует copy
- **THEN** система записывает текущий output text в clipboard
- **AND** система показывает copy success feedback

#### Scenario: Пользователь пытается скопировать пустой output

- **WHEN** output text field пуст и пользователь активирует copy
- **THEN** система не записывает данные в clipboard
- **AND** система сообщает, что output для копирования отсутствует

### Requirement: Mobile generation переводит пользователя к результату

Система SHALL переводить mobile-пользователей к generated output после успешной конвертации.

#### Scenario: Mobile-пользователь генерирует output

- **WHEN** пользователь отправляет валидные данные на mobile viewport и конвертация завершается успешно
- **THEN** система прокручивает или переводит focus к generated output field и copy action

#### Scenario: Desktop-пользователь генерирует output

- **WHEN** пользователь отправляет валидные данные на desktop viewport и конвертация завершается успешно
- **THEN** система сохраняет видимость двухколоночного workflow без принудительного mobile-style перехода

### Requirement: Реализация соблюдает frontend architecture проекта

Система SHALL реализовывать конвертер через layer boundaries проекта и не размещать business logic в route files или shared UI primitives.

#### Scenario: Route рендерит feature container

- **WHEN** страница конвертера реализована
- **THEN** `src/app/page.tsx` только рендерит feature container и route-level shell
- **AND** API calls, validation и mutation orchestration реализованы вне `src/app`

#### Scenario: API contract изолирован

- **WHEN** frontend вызывает conversion backend
- **THEN** DTO types объявлены в `src/types`
- **AND** HTTP calls объявлены в `src/api`
- **AND** feature orchestration объявлена в `src/features/clashConverter`
