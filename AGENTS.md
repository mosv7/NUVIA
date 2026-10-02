# Repository Guidelines

## Project Structure & Module Organization

This workspace currently has no source files, build configuration, tests, or Git metadata. Update this guide as the project takes shape. When adding the initial implementation, organize application code in `src/`, automated tests in `tests/`, static resources in `assets/`, and supporting documentation in `docs/`. Adapt these paths to the chosen framework and document any differences.

## Build, Test, and Development Commands

No build, test, or local development commands are configured yet. When selecting a toolchain, document its prerequisites and exact commands in `README.md`. Provide clear entry points for running locally, building release artifacts, checking formatting, and executing tests. Avoid documenting commands until they work from a clean checkout.

## Coding Style & Naming Conventions

Follow the conventions of the selected language and framework. Configure a formatter and linter before substantial implementation, and commit their configuration. Use consistent indentation within each file, descriptive names for modules and functions, and filenames that reflect their purpose. Keep modules focused and avoid mixing unrelated responsibilities.

## Testing Guidelines

No testing framework or coverage threshold is established. Add a suitable framework with the first executable code. Name tests after the behavior they verify and follow the framework's discovery conventions. Cover expected behavior, edge cases, and failure handling; include regression tests for bug fixes. Document how contributors run the suite.

## Commit & Pull Request Guidelines

No Git history is available to establish existing commit conventions. Use concise, imperative commit subjects, such as `Add initial application structure`. Keep each commit focused. Pull requests should explain the change, link relevant issues, report validation performed, and include screenshots for visible interface changes.

## Security & Configuration

Keep secrets and local credentials out of version control. Provide placeholder configuration examples and document required environment variables when configuration is introduced. Add generated artifacts and local configuration files to `.gitignore`.
