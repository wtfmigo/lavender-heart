# Lavender Heart — Phase 0 technical report

Date: 2026-10-07 (Asia/Manila). Project root: `C:/programmers/xampp/files/htdocs/gf parallax/lavender-heart/`.

Status: technical foundation verified; stopped for review. The original workspace was empty, with no SKILLS_INSTALL.md or existing files to preserve. No Git repository or commits were created.

## Environment and versions

| Tool | Installed version |
| --- | --- |
| PHP (XAMPP CLI) | 8.2.12 |
| Node | 24.18.0 |
| npm | 11.16.0 |
| Composer | 2.10.2 |
| Laravel application skeleton | 12.12.2 |
| Laravel framework | 12.69.3 |

Laravel 12 was selected for the installed PHP 8.2. Laravel 13 requires PHP 8.3+, per [Laravel release notes](https://laravel.com/framework/docs/releases). MySQL/MariaDB is the configured target; no database connection, creation, or migration was attempted.

## Installed direct frontend packages

These are resolved installed versions, not semver ranges. Exact transitive dependencies are recorded in frontend/package-lock.json. ScrollTrigger is included in gsap; it is not a separate package. Motion is the approved Motion/Framer Motion choice. No extra UI library was installed.

| Package | Version |
| --- | --- |
| @eslint/js | 10.0.1 |
| @gsap/react | 2.1.2 |
| @playwright/test | 1.63.0 |
| @react-three/drei | 10.7.9 |
| @react-three/fiber | 9.8.1 |
| @tailwindcss/vite | 4.3.3 |
| @tanstack/react-query | 5.104.1 |
| @testing-library/jest-dom | 7.0.1 |
| @testing-library/react | 16.3.3 |
| @testing-library/user-event | 14.6.7 |
| @types/node | 24.19.1 |
| @types/react | 19.3.0 |
| @types/react-dom | 19.3.0 |
| @types/three | 0.186.0 |
| @vitejs/plugin-react | 6.1.2 |
| axios | 1.20.0 |
| eslint | 10.12.0 |
| eslint-config-prettier | 10.1.8 |
| eslint-plugin-react-hooks | 7.1.1 |
| eslint-plugin-react-refresh | 0.5.7 |
| globals | 17.13.0 |
| gsap | 3.15.0 |
| jsdom | 30.1.2 |
| lenis | 1.3.26 |
| motion | 14.0.0 |
| prettier | 3.9.9 |
| react | 19.3.0 |
| react-dom | 19.3.0 |
| react-router | 8.4.0 |
| tailwindcss | 4.3.3 |
| three | 0.186.1 |
| typescript | 6.0.3 |
| typescript-eslint | 8.71.1 |
| vite | 8.3.3 |
| vitest | 5.0.3 |
| zod | 4.6.5 |
| zustand | 5.0.15 |

## Installed direct backend packages

Exact transitive dependencies are recorded in backend/composer.lock. Standard Laravel tooling is retained. Generated Sail/Pail dependencies and the duplicate backend Vite frontend were removed.

| Package | Version |
| --- | --- |
| fakerphp/faker | 1.24.1 |
| laravel/framework | 12.69.3 |
| laravel/pint | 1.30.4 |
| laravel/sanctum | 4.3.3 |
| laravel/tinker | 2.11.1 |
| mockery/mockery | 1.6.15 |
| nunomaduro/collision | 8.9.5 |
| phpunit/phpunit | 11.5.57 |

## Architecture and configuration

- Independent frontend and backend applications. The frontend talks to Laravel through Axios and never to MySQL.
- React layers: app/router/providers; models/types/schemas; views/pages/layouts/components; controllers/hooks/modules; services/http/api; stores; features; styles/utils/constants; dedicated three and animations directories. Otherwise-unused layers have short responsibility READMEs, without fake domain code.
- Strict TypeScript applies to both app and tooling/tests. `@/*` works in TypeScript and Vite.
- QueryClientProvider wraps routing. The only query is the technical health check, enabled only when the API URL is configured. No Zustand store or product Zod schema exists.
- Main route `/` is a plain technical placeholder. Development-only `/__smoke/three` lazy-loads a box and an error boundary/Canvas fallback; the scene is excluded from the production bundle.
- Tailwind uses its Vite plugin and CSS import, following the [official setup](https://tailwindcss.com/docs/installation/using-vite). Custom CSS only selects a system font.
- GSAP/ScrollTrigger own future scroll animation; Three/R3F own WebGL; Motion owns small UI transitions; CSS owns simple transitions; Lenis owns smooth scrolling. No real animation is implemented.
- Laravel conventions remain intact, with Actions/Services/Policies and Http Requests/Resources/Middleware responsibility notes. No Lavender Heart domain model exists; the stock Laravel User model is retained.
- Sanctum 4.3.3 is installed with published config, token migration, registered CSRF-cookie route, and stateful API middleware. CORS origins and Sanctum domains use environment values. No auth flow is implemented.
- Local sessions/cache use files and queues use sync so health/bootstrap do not require a database.
- Root .htaccess denies direct Apache access inside this htdocs workspace; the intended local entry points are Vite and Artisan. Existing Apache config permits .htaccess overrides. Access to backend/.env was verified to return HTTP 403.

## Environment files and ignores

Created frontend/.env.example with blank VITE_API_BASE_URL and backend/.env.example with MySQL placeholders: DB_CONNECTION=mysql, DB_HOST=127.0.0.1, DB_PORT=3306, DB_DATABASE=lavender_heart, blank DB_USERNAME/DB_PASSWORD. Backend retains normal Laravel environment settings plus FRONTEND_URL/SANCTUM_STATEFUL_DOMAINS.

Created private ignored backend/.env from the example and generated a local application key. No frontend .env was necessary for verification; Playwright supplies the API URL through its server environment. No credentials were printed or committed. Root/app ignores protect environment files, dependencies, builds, coverage, browser results, and runtime files while retaining .env.example and Laravel storage placeholders. Git ignore rules were checked using a temporary bare repository, which was removed; no repository was added to the project.

No localhost URLs exist in frontend source or custom backend app/routes/CORS/Sanctum source logic. Development URLs appear only in examples and test/tooling configuration; Laravel's stock framework configuration retains its normal defaults.

## Verification commands and results

Windows used npm.cmd/npx.cmd because PowerShell script execution blocks npm.ps1. Composer archive installation used `php -d extension=zip C:\\ProgramData\\ComposerSetup\\bin\\composer.phar` without modifying global PHP configuration.

| Location | Command/check | Result |
| --- | --- | --- |
| frontend | npm.cmd install --package-lock-only --ignore-scripts | Passed; 0 vulnerabilities |
| frontend | npm.cmd ci | Passed; clean install, 0 vulnerabilities |
| frontend | npm.cmd run typecheck | Passed |
| frontend | npm.cmd run lint | Passed |
| frontend | npm.cmd run format:check | Passed |
| frontend | npm.cmd run test | 2 tests passed |
| frontend | npm.cmd run build | Passed; CSS and JS emitted |
| frontend | npx.cmd playwright install chromium | Passed |
| frontend | npm.cmd run e2e | 3 Chromium tests passed |
| frontend | npm.cmd ls --depth=0 --json | Passed; compatible installed dependency tree |
| backend | Composer install --no-interaction | Passed |
| backend | composer validate --strict | Passed |
| backend | composer check-platform-reqs | Passed |
| backend | composer lint / php vendor/bin/pint --test | Passed |
| backend | composer test / php artisan test | 2 tests passed; 3 assertions |
| backend | php artisan about --only=environment | Laravel boots on PHP 8.2.12 |
| backend | php artisan route:list --path=api | GET/HEAD api/health registered |
| backend | php artisan route:list --path=sanctum | Sanctum CSRF-cookie route registered |
| backend | curl.exe --include http://127.0.0.1:8002/api/health | HTTP 200; {"status":"ok"} |
| root | curl status check on Apache backend/.env path | HTTP 403 |
| root | rg scan for localhost/127.0.0.1 in app source/custom CORS/Sanctum | No matches |
| root | rg scan of production dist for smoke route/scene strings | No matches |
| root | git check-ignore with temporary git-dir | Secrets/artifacts ignored, examples/storage placeholders retained |

The frontend render and API health smoke tests were observed failing before implementation (missing placeholder and HTTP 404), then passing. The frontend stack test imports Three, R3F, Drei, GSAP, ScrollTrigger, @gsap/react, Lenis, and Motion together. Browser tests check the main route, Tailwind padding, custom font CSS, actual browser-to-Laravel connectivity, R3F rendering, and forced WebGL fallback. Laravel tests check root boot and exact health JSON; they do not access MySQL.

Read-only review used the [requesting-code-review skill](C:/Users/Acer/.codex/skills/requesting-code-review/SKILL.md). Its Apache exposure finding was verified and fixed. Temporary Playwright/Artisan verification servers were stopped; no app was deployed.

## Warnings and remaining setup

- MySQL/MariaDB database credentials, database creation, and migrations remain manual setup. Their commands are in README.md. Actual database connectivity was not verified.
- PHP ZIP is disabled globally in XAMPP. Command-local extension activation works; no system configuration was changed.
- Three/R3F/Drei emit upstream deprecation warnings for CommonJS Three imports in the Node smoke test and Three.Clock in the development scene. These do not fail tests or the build; no dependency source was patched.
- The fallback test intentionally forces missing WebGL, producing renderer/React error logs while the error boundary successfully displays the fallback.
- The harness sets both NO_COLOR and FORCE_COLOR, producing cosmetic terminal warnings.
- Initial package JSON encoding, import-test timeout, Playwright DOM typing, and test formatting issues were corrected; final checks above pass.
- Only Chromium E2E was run. No auth flow, database integration, or product feature tests are applicable to this phase.

## Exact created files and folders

All paths below are relative to lavender-heart/. This is the complete source/configuration/documentation inventory, including generated Laravel convention files and storage placeholders. Dependency trees, build output, runtime cache/log/session files, and Playwright results are generated/ignored. Private backend/.env is listed separately above.

Source file count: 111.

```text
.gitignore
.htaccess
README.md
backend/.editorconfig
backend/.env.example
backend/.gitattributes
backend/.gitignore
backend/README.md
backend/app/Actions/README.md
backend/app/Http/Controllers/Controller.php
backend/app/Http/Middleware/README.md
backend/app/Http/Requests/README.md
backend/app/Http/Resources/README.md
backend/app/Models/User.php
backend/app/Policies/README.md
backend/app/Providers/AppServiceProvider.php
backend/app/Services/README.md
backend/artisan
backend/bootstrap/app.php
backend/bootstrap/cache/.gitignore
backend/bootstrap/providers.php
backend/composer.json
backend/composer.lock
backend/config/app.php
backend/config/auth.php
backend/config/cache.php
backend/config/cors.php
backend/config/database.php
backend/config/filesystems.php
backend/config/logging.php
backend/config/mail.php
backend/config/queue.php
backend/config/sanctum.php
backend/config/services.php
backend/config/session.php
backend/database/.gitignore
backend/database/factories/UserFactory.php
backend/database/migrations/0001_01_01_000000_create_users_table.php
backend/database/migrations/0001_01_01_000001_create_cache_table.php
backend/database/migrations/0001_01_01_000002_create_jobs_table.php
backend/database/migrations/2026_10_07_140648_create_personal_access_tokens_table.php
backend/database/seeders/DatabaseSeeder.php
backend/phpunit.xml
backend/public/.htaccess
backend/public/favicon.ico
backend/public/index.php
backend/public/robots.txt
backend/routes/api.php
backend/routes/console.php
backend/routes/web.php
backend/storage/app/.gitignore
backend/storage/app/private/.gitignore
backend/storage/app/public/.gitignore
backend/storage/framework/.gitignore
backend/storage/framework/cache/.gitignore
backend/storage/framework/cache/data/.gitignore
backend/storage/framework/sessions/.gitignore
backend/storage/framework/testing/.gitignore
backend/storage/framework/views/.gitignore
backend/storage/logs/.gitignore
backend/tests/Feature/ExampleTest.php
backend/tests/Feature/HealthTest.php
backend/tests/TestCase.php
backend/tests/Unit/README.md
docs/phase-0-report.md
docs/superpowers/plans/2026-10-07-phase-0.md
frontend/.env.example
frontend/.gitignore
frontend/.prettierignore
frontend/README.md
frontend/eslint.config.js
frontend/index.html
frontend/package-lock.json
frontend/package.json
frontend/playwright.config.ts
frontend/prettier.config.js
frontend/public/README.md
frontend/src/animations/gsap/README.md
frontend/src/animations/motion/README.md
frontend/src/app/App.tsx
frontend/src/app/providers/AppProviders.tsx
frontend/src/app/router.tsx
frontend/src/constants/README.md
frontend/src/controllers/hooks/useHealth.ts
frontend/src/controllers/modules/README.md
frontend/src/features/README.md
frontend/src/main.tsx
frontend/src/models/schemas/README.md
frontend/src/models/types/README.md
frontend/src/services/api/health.ts
frontend/src/services/http/client.ts
frontend/src/stores/README.md
frontend/src/styles/base.css
frontend/src/test/App.test.tsx
frontend/src/test/setup.ts
frontend/src/test/stack.test.ts
frontend/src/three/components/README.md
frontend/src/three/hooks/README.md
frontend/src/three/materials/README.md
frontend/src/three/scenes/SmokeScene.tsx
frontend/src/three/utils/README.md
frontend/src/utils/README.md
frontend/src/views/components/README.md
frontend/src/views/layouts/README.md
frontend/src/views/pages/SetupPage.tsx
frontend/src/vite-env.d.ts
frontend/tests/e2e/foundation.spec.ts
frontend/tsconfig.app.json
frontend/tsconfig.json
frontend/tsconfig.node.json
frontend/vite.config.ts
```

Tracked architectural/convention directories represented by those files:

```text
backend/
backend/app/
backend/app/Actions/
backend/app/Http/
backend/app/Http/Controllers/
backend/app/Http/Middleware/
backend/app/Http/Requests/
backend/app/Http/Resources/
backend/app/Models/
backend/app/Policies/
backend/app/Providers/
backend/app/Services/
backend/bootstrap/
backend/bootstrap/cache/
backend/config/
backend/database/
backend/database/factories/
backend/database/migrations/
backend/database/seeders/
backend/public/
backend/routes/
backend/storage/
backend/storage/app/
backend/storage/app/private/
backend/storage/app/public/
backend/storage/framework/
backend/storage/framework/cache/
backend/storage/framework/cache/data/
backend/storage/framework/sessions/
backend/storage/framework/testing/
backend/storage/framework/views/
backend/storage/logs/
backend/tests/
backend/tests/Feature/
backend/tests/Unit/
docs/
docs/superpowers/
docs/superpowers/plans/
frontend/
frontend/public/
frontend/src/
frontend/src/animations/
frontend/src/animations/gsap/
frontend/src/animations/motion/
frontend/src/app/
frontend/src/app/providers/
frontend/src/constants/
frontend/src/controllers/
frontend/src/controllers/hooks/
frontend/src/controllers/modules/
frontend/src/features/
frontend/src/models/
frontend/src/models/schemas/
frontend/src/models/types/
frontend/src/services/
frontend/src/services/api/
frontend/src/services/http/
frontend/src/stores/
frontend/src/styles/
frontend/src/test/
frontend/src/three/
frontend/src/three/components/
frontend/src/three/hooks/
frontend/src/three/materials/
frontend/src/three/scenes/
frontend/src/three/utils/
frontend/src/utils/
frontend/src/views/
frontend/src/views/components/
frontend/src/views/layouts/
frontend/src/views/pages/
frontend/tests/
frontend/tests/e2e/
```

Additional generated/local directories: frontend/node_modules/, frontend/dist/, frontend/test-results/, backend/vendor/, backend/bootstrap/cache/ (runtime contents), and backend/storage/ runtime contents.

## Explicit scope confirmation

- No Lavender Heart product features were implemented.
- No final design was implemented.
- No PROJECT_CONTEXT.md was created.
- No DESIGN.md was created.
- No AGENTS.md was created.
- SKILLS_INSTALL.md was absent and was not created or rewritten.
- Phase 1 has not started. Stop here for user review and explicit approval.

