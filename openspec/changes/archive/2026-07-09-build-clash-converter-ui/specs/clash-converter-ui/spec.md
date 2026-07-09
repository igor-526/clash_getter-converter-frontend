## ADDED Requirements

### Requirement: Converter page renders the primary workflow

The system SHALL render a single `Clash Converter` page that lets the user input conversion data, run generation, inspect the generated output, edit it, and copy it.

#### Scenario: Desktop user opens the converter

- **WHEN** the user opens the application on a desktop viewport
- **THEN** the system shows a non-functional header with the title `Clash Converter`
- **AND** the header title is aligned to the left
- **AND** the main workflow is split into input controls on the left and generated output controls on the right

#### Scenario: Mobile user opens the converter

- **WHEN** the user opens the application on a mobile viewport
- **THEN** the system shows a non-functional header with the title `Clash Converter`
- **AND** the header title is centered
- **AND** the generated output block is positioned below the input block

### Requirement: User can submit conversion input

The system SHALL provide a form with configuration name, output format, RAW input, and a generate action.

#### Scenario: Default output format is YAML

- **WHEN** the converter form is first rendered
- **THEN** the output format selection is set to `YAML`

#### Scenario: User enters a RAW VPN link

- **WHEN** the user enters a configuration name, selects an output format, enters a RAW VPN link, and submits the form
- **THEN** the system sends the entered name, selected output format, and raw value to the backend conversion endpoint

#### Scenario: User selects output format

- **WHEN** the user chooses an output format
- **THEN** the system allows only `YAML` and `JSON` choices
- **AND** the submitted `out_type` value is either `yaml` or `json`

#### Scenario: User enters a WireGuard config

- **WHEN** the user enters a complete multi-line WireGuard config and submits the form
- **THEN** the system preserves line breaks and sends the full raw value to the backend conversion endpoint

#### Scenario: User submits invalid input

- **WHEN** the user submits the form without a non-empty raw value
- **THEN** the system blocks the backend request
- **AND** the system shows a validation error near the raw input

### Requirement: Frontend uses the backend conversion API

The system SHALL call the backend `POST /api/v1/convert` endpoint using the OpenAPI-compatible request and response contracts.

#### Scenario: Backend URL is configured

- **WHEN** the application sends a conversion request
- **THEN** the backend base URL is read from an environment variable
- **AND** the application does not use a hardcoded fallback backend URL

#### Scenario: Successful conversion request

- **WHEN** the user submits valid conversion data
- **THEN** the system sends a JSON request matching `ConvertInDto`
- **AND** the system reads the JSON response matching `ConvertOutDto`
- **AND** the generated output field is populated with the response `result`

#### Scenario: Backend conversion fails

- **WHEN** the backend returns a validation error or request failure
- **THEN** the system shows an error state to the user
- **AND** the system keeps the previously generated or manually edited output unchanged

### Requirement: User can edit and copy generated output

The system SHALL show generated output in an editable text field and provide a copy action.

#### Scenario: Generated output appears

- **WHEN** a conversion request succeeds
- **THEN** the output text field contains the generated result
- **AND** the user can edit the output text manually

#### Scenario: User copies output

- **WHEN** the output text field contains text and the user activates copy
- **THEN** the system writes the current output text to the clipboard
- **AND** the system shows copy success feedback

#### Scenario: User tries to copy empty output

- **WHEN** the output text field is empty and the user activates copy
- **THEN** the system does not write to the clipboard
- **AND** the system indicates that there is no output to copy

### Requirement: Mobile generation moves user to the result

The system SHALL move mobile users to the generated output after successful conversion.

#### Scenario: Mobile user generates output

- **WHEN** the user submits valid data on a mobile viewport and the conversion succeeds
- **THEN** the system scrolls or moves focus to the generated output field and copy action

#### Scenario: Desktop user generates output

- **WHEN** the user submits valid data on a desktop viewport and the conversion succeeds
- **THEN** the system keeps the two-column workflow visible without forcing a mobile-style jump

### Requirement: Implementation follows the project frontend architecture

The system SHALL implement the converter through the project layer boundaries and avoid placing business logic in route files or shared UI primitives.

#### Scenario: Route renders feature container

- **WHEN** the converter page is implemented
- **THEN** `src/app/page.tsx` only renders the feature container and route-level shell
- **AND** API calls, validation, and mutation orchestration are implemented outside `src/app`

#### Scenario: API contract is isolated

- **WHEN** the frontend calls the conversion backend
- **THEN** DTO types are declared under `src/types`
- **AND** HTTP calls are declared under `src/api`
- **AND** feature orchestration is declared under `src/features/clashConverter`
