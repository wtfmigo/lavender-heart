# Lavender Heart

Status: **Phase 0 — technical foundation only.** Independent apps: `frontend/` (React/TypeScript/Vite) and `backend/` (Laravel REST API). No product or final design is implemented.

Prerequisites: Node 22.12+ or 24+, npm, Composer, PHP 8.2+ with Laravel extensions, and XAMPP MySQL/MariaDB. Laravel 12 supports the installed PHP 8.2; Laravel 13 needs PHP 8.3+. Enable PHP ZIP for Composer archives or use `php -d extension=zip C:\ProgramData\ComposerSetup\bin\composer.phar` instead of `composer` on this XAMPP installation. On Windows with restricted PowerShell execution, use `npm.cmd` / `npx.cmd`.

From the project root:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan serve
```

In another terminal:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000/api/ in .env.
npm run dev
```

Open the Vite URL. The plain `/` screen shows frontend and API status. Development-only `/__smoke/three` renders a primitive with a WebGL fallback; it is excluded from production routing/bundles.

Set backend `APP_URL`, `FRONTEND_URL` (comma-separated permitted origins), and `SANCTUM_STATEFUL_DOMAINS` (hosts with ports, no scheme) to match your local hosts. Use the same hostname for both apps for future first-party Sanctum cookies. CORS accepts configured origins and credentials. Sanctum is installed with stateful API middleware, configuration, and an unexecuted token migration; no login or auth flow exists.

Configure private backend `.env` with your XAMPP database credentials. If needed, create only the project database yourself through phpMyAdmin or MySQL:

```sql
CREATE DATABASE lavender_heart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then run `php artisan migrate` when ready. Bootstrap does not create databases or run migrations. Health checks need no database; sessions/cache use files and queues use sync. Root `.htaccess` denies direct Apache access because this workspace is inside XAMPP htdocs; use the separate Vite/artisan servers. For Apache hosting, point a virtual host only at `backend/public/` and keep private project files outside the served document root.

Quality checks:

```powershell
cd frontend
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npx playwright install chromium
npm run e2e

cd ../backend
composer test
composer lint
composer check-platform-reqs
```

Playwright starts separate frontend/API servers on ports 5174/8001 and checks real CORS connectivity plus development WebGL rendering. Unit tests run in Vitest/RTL; Laravel uses PHPUnit (isolated SQLite memory settings, no MySQL access). `npm run format` and `composer format` apply formatting. API health: `GET /api/health` returns `{"status":"ok"}`.

React responsibilities: models = types/schemas; views = pages/layouts/components; controllers = hooks/orchestration; services = HTTP/API; stores = shared client state only; TanStack Query = server state. Animation ownership: GSAP/ScrollTrigger = scroll scenes; R3F = WebGL; Motion = small UI transitions; CSS = simple transitions; Lenis = smooth scrolling. These tools are installed; no real animations are implemented.
