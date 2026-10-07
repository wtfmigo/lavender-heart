# Lavender Heart — AI Skills & Tooling Setup

**Status:** Phase 4 documentation only, awaiting review and explicit approval. No skills, plugins, hooks, MCP servers, or packages are installed by this phase. `PROJECT_CONTEXT.md`, `DESIGN.md`, and `AGENTS.md` are approved and unchanged.

**All installation, discovery, and update examples below are instructions for a later approved setup phase.** Upstream documentation/source was checked during Phase 4 on 2026-10-07–08 (Asia/Manila); installers were not executed. Recheck upstream and the chosen released package before execution because repository `main` and published releases can differ.

## 1. Purpose

This guide defines the approved agent tooling, its scope, safe installation, task routing, verification, and updates. Skills guide development; they do not become public features or authorize implementation. The React SPA, Laravel API, runtime stack, and animation ownership remain controlled by the approved project documents.

Each tool section links the upstream sources used to verify its instructions. Commands are PowerShell-compatible and run from `lavender-heart/` unless a different location is explicitly stated. Do not run the examples as one unattended installation script.

## 2. Project-Local Policy

Prefer installation inside Lavender Heart. Do not alter the workflows of SoleSpace, OJT Tracker, or other projects. For the Skills CLI, project scope is the default; omit `--global`/`-g` and explicitly target Codex. Review the destination before confirming. Superpowers is the approved harness/plugin-level exception. [Skills CLI scope documentation](https://github.com/vercel-labs/skills#installation-scope).

Project-local does not mean that an installer never downloads executables or uses a user cache. Review those effects too. Laravel Boost belongs in `backend/` as a development package, with project-scoped agent configuration preferred. The optional Chrome extension belongs to a browser profile, not the application.

Existing user/global skills must be inspected for duplicates before later installation. Do not remove or replace shared skills without approval; other projects may depend on them.

## 3. Prerequisites and Current Environment

Read the project documents, `README.md`, manifests, and lockfiles before later setup. Phase 0 remains a layered React/TypeScript/Vite SPA and Laravel REST API with Sanctum preparation, PHPUnit, and technical smoke tests. Product authentication, admin, media, and cinematic scenes are not implemented.

Read-only local checks during Phase 4 found:

| Tool / state | Observed |
| --- | --- |
| Node / npm | 24.18.0 / 11.16.0 |
| Git executable | 2.55.0.windows.2 |
| Project Git repository / remote | Not initialized / not configured; no worktrees or commits available |
| PHP | XAMPP CLI 8.2.12 |
| Composer | 2.10.2 |
| Python | 3.14.6; needed by UI/UX Pro Max's search scripts |
| Codex CLI | 0.144.1; `codex.cmd` available |
| Existing workflow skills | Superpowers skills exposed through the user-level skill catalog; marketplace plugin installation not independently verified |
| Project skill/config directories and skill lock | Not created by this phase |

Git being installed is not a Git repository. Do not initialize one in Phase 4. Obtain later setup authorization and make a recoverable checkpoint before installers can alter instructions/configuration. Preserve private `.env` files. Application database connectivity remains unverified; no migration or database setup is required for this document.

For future environment checks:

```powershell
node --version
npm.cmd --version
git --version
php --version
composer --version
python --version
codex.cmd --version
```

UI/UX Pro Max requires Python 3 for local search. Do not install Python or other system software automatically if absent. [UI/UX Pro Max prerequisites](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill#prerequisites).

## 4. Superpowers — Required

Source: [obra/superpowers README, Codex installation](https://github.com/obra/superpowers#codex-app).

Use for brainstorming, implementation plans, worktrees when Git exists, TDD, systematic debugging, subagent development, review, verification, and branch completion. `AGENTS.md` governs approval gates and project-specific execution. Documentation-only phases do not trigger implementation or branch creation.

Current supported installation is through the Codex plugin marketplace:

- **Codex app:** open **Plugins** in the sidebar, find **Superpowers** in **Coding**, select its install control, and follow the prompts.
- **Codex CLI:** inside the interactive Codex session, enter `/plugins`, search `superpowers`, and choose **Install Plugin**.

These are harness controls, not PowerShell commands. This plugin-level installation is an explicit exception to project-local preference. Inspect existing user-level Superpowers skills first so the plugin does not create duplicate workflow guidance. Do not add obsolete `superpowers-codex bootstrap` instructions or manually duplicate the plugin into repository skill folders.

Verify the plugin listing and a fresh session's recognition of the workflow with a planning-only synthetic request. No example should start implementing Lavender Heart. Update through the current Codex plugin mechanism and reverify in a fresh session; do not assume manual copies update with the plugin.

## 5. UI/UX Pro Max — Required

Sources: [upstream README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill#using-cli-recommended), [CLI package identity](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/package.json), [Codex template](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/templates/platforms/codex.json).

Use for approved React/Tailwind layout, spacing, typography, responsive composition, UX, and accessibility guidance. It must not replace the lavender presets, Cormorant Garamond/Inter, nine chapters, or approved compositions with a generated design system.

From the project root, later preview and then install only if the preview remains within approved scope:

```powershell
npx.cmd ui-ux-pro-max-cli init --ai codex --dry-run
npx.cmd ui-ux-pro-max-cli init --ai codex
```

The package is `ui-ux-pro-max-cli`; its executable is `uipro`. NPX avoids the README's global CLI installation step. Do not use old `uipro-cli`, `--global`, `--ai all`, or overwrite/force flags. Current Codex template targets `.agents/skills/ui-ux-pro-max/`, including its data/scripts.

**Bundle review gate:** current [installer source](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/cli/src/utils/template.ts) also copies bundled sibling skills. Inspect the dry-run output and each payload. Additional independently discoverable skills outside this guide's approved set require explicit approval; if included, stop before the install command. Do not invent a selective-install flag or silently accept the whole bundle.

Verify `SKILL.md`, local assets, Python search, and Codex discovery. For updates, review the chosen CLI release and use its documented `uipro update` operation through the same package, project scope; preview/review bundled changes again.

## 6. Hallmark — Required

Source: [Nutlope/hallmark README](https://github.com/Nutlope/hallmark), with [skill instructions and references](https://github.com/Nutlope/hallmark/tree/main/skills/hallmark).

Use for anti-AI-slop audits and reference study of high-level structure, type relationships, color anchors, spacing, composition, and rhythm. Audit/study must not edit the application unless requested. Do not use its default UI generation or redesign to replace approved design decisions.

Later discovery and selected project installation:

```powershell
npx.cmd skills add nutlope/hallmark --list
npx.cmd skills add nutlope/hallmark --skill hallmark --agent codex
```

The current skill identifier is `hallmark`; verify it in the listing before installation. This Skills CLI route uses `.agents/skills/hallmark/`. Hallmark's README also describes manual `.codex/skills/hallmark/` copies; do not install both routes. Prefer the current CLI/Codex discovery path and preserve references with the skill.

These are agent prompts, not a separate installed `hallmark` shell executable:

```text
hallmark audit <target>
hallmark study <screenshot-or-url>
hallmark redesign <target>
```

Redesign requires separately approved design changes. Study refuses pixel cloning; save any generated reference document separately from the approved `DESIGN.md`. Verify audit with synthetic content and confirm no edits. Update only the selected skill after checkpoint and upstream review.

## 7. Official GSAP Skills — Required

Source: [GreenSock's official gsap-skills repository](https://github.com/greensock/gsap-skills). Its README and selected `SKILL.md` files currently identify `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, and `gsap-performance`.

Use for core tweens, sequencing, horizontal storytelling, pinning, parallax, ScrollTrigger refresh/cleanup, React lifecycle, and performance. Skills do not install GSAP runtime packages; GSAP and `@gsap/react` already exist in the frontend.

Later list first, then install only these verified identifiers if still present:

```powershell
npx.cmd skills add https://github.com/greensock/gsap-skills --list
npx.cmd skills add https://github.com/greensock/gsap-skills --skill gsap-core --skill gsap-timeline --skill gsap-scrolltrigger --skill gsap-react --skill gsap-performance --agent codex
```

Destination: project `.agents/skills/<selected-name>/`. Do not install all skills or unrelated framework/plugin collections by default. GSAP owns the scroll/reveal responsibilities in `AGENTS.md`; it does not take over Motion's UI transitions, R3F's scene properties, CSS's small transitions, or Lenis's interpolation.

Verify the five skills in Codex and inspect lifecycle/reduced-motion guidance against project rules. Update selected names deliberately, reviewing changed advice and duplicate/global copies.

## 8. Three.js / R3F Skills — Required, Community-Maintained

Source: [cesartevisual/threejs-skills](https://github.com/cesartevisual/threejs-skills). This collection is **community-maintained and independent of the official Three.js maintainers**.

Use `threejs-r3f`, `threejs-web`, and `threejs-debugging` for the approved heart scene, R3F architecture, materials/light/camera, responsive rendering, cleanup, performance, accessibility/fallback, and rendering diagnosis. Exact headers were checked in the upstream skill files.

```powershell
npx.cmd skills add cesartevisual/threejs-skills --list
npx.cmd skills add cesartevisual/threejs-skills --skill threejs-r3f --skill threejs-web --skill threejs-debugging --agent codex
```

Recheck identifiers before later installation. Project destination is `.agents/skills/<selected-name>/`. Preserve linked references. Do not install unrelated WebGPU-only, game/physics, XR, audio, particles, or shader-specialist skills without a future approved need.

Keep existing Three/R3F/Drei versions and scene ownership; do not migrate renderers or add viewer controls/features because an example suggests them. Hero/finale must remain readable with the lightweight heart fallback. Verify community provenance and selected skills in a fresh session; update these names only after source/script review.

## 9. Vercel Agent Skills — Two Required Skills Only

Sources: [vercel-labs/agent-skills README](https://github.com/vercel-labs/agent-skills), [React skill header](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md), [Web Design Guidelines header](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md).

Use React Best Practices for SPA rendering, rerenders, bundle cost, and client data fetching. Use Web Design Guidelines for accessibility, keyboard/focus, forms, images, reduced motion, and responsive UX review.

The README/folder calls the React skill `react-best-practices`, but its current `name` is **`vercel-react-best-practices`**. Web's identifier is **`web-design-guidelines`**. Discover before installing:

```powershell
npx.cmd skills add vercel-labs/agent-skills --list
npx.cmd skills add vercel-labs/agent-skills --skill vercel-react-best-practices --skill web-design-guidelines --agent codex
```

Run the second command only when the first confirms those installer-visible names; otherwise inspect upstream headers and select the equivalent approved pair, reporting the difference. Do not guess from directory names.

CLI destination: `.agents/skills/<installed-name>/`. Verify the pair and no deployment/mobile extras. Installing Vercel guidance does not authorize Vercel hosting, Next.js migration, React Native, server components, analytics, or replacing TanStack Query with another client library. Apply only rules relevant to this SPA. Update this pair intentionally, not the full collection.

## 10. Impeccable — Required for Polish

Source: [pbakaus/impeccable installation and Codex usage](https://github.com/pbakaus/impeccable).

Use **after functionality works** for audit, critique, polish, distillation, simplification, refinement, and anti-slop review. Approved typography/lavender are deliberate brand choices; generic detector findings are review inputs, not permission to redesign.

```powershell
npx.cmd impeccable install --providers=codex --scope=project
```

This selects Codex/project scope. Review remaining prompts, including hook consent; do not use force to replace malformed/existing configuration. Current destinations include `.agents/skills/impeccable/` and provider hook `.codex/hooks.json`. Upstream also uses executable launchers/cache; inspect them before approval.

If the CLI is unavailable, use the upstream Codex ZIP/manual payload route: reviewed `dist/agents/.agents/` skills plus the reviewed `dist/codex/.codex/hooks.json`, merging existing configuration carefully. Do not invent another npm package or copy an entire checkout into authoritative files.

Verify via `/skills` or `$impeccable`, then use a synthetic audit. Refresh with the documented `impeccable update` operation, checking scope and changed prompts/configuration. [Upstream usage/update instructions](https://github.com/pbakaus/impeccable#usage).

### Hook approval

After install/update, inspect hook commands, Windows launcher, permissions, and possible downloads, then open `/hooks` in Codex and approve only the reviewed definition. Changed definitions can require renewed trust. Upstream supports `--no-hooks` to skip hooks for a run; hook installation/approval must never be blind. Review `.impeccable/` configuration/cache effects too. [Impeccable hook documentation](https://impeccable.style/docs/hooks/).

## 11. Laravel Boost — Backend-Specific

Sources: [official Laravel Boost repository](https://github.com/laravel/boost), [official installation/MCP documentation](https://laravel.com/framework/docs/boost), [current package requirements](https://github.com/laravel/boost/blob/main/composer.json).

Use with Superpowers for Laravel conventions, framework documentation, routes, Form Requests, Eloquent, migrations, Sanctum, authorization, Storage, testing, and backend architecture. Boost is a **backend development Composer package/MCP tool**, not a frontend skill package or product AI feature.

Current source permits PHP 8.2 and Laravel 12.41.1+, matching the foundation's PHP 8.2.12/Laravel 12.69.3 at the direct-constraint level. Later Composer resolution must still confirm the selected release and transitive compatibility. Do not upgrade Laravel/PHP or bypass platform requirements merely to install tooling.

From the project root, in later approved setup:

```powershell
Set-Location backend
composer require laravel/boost --dev --dry-run
```

Inspect the proposed dependency changes. After that review, package installation and resource generation are **separate steps**:

```powershell
composer require laravel/boost --dev
```

Before the next command, checkpoint root `AGENTS.md` and all relevant configuration, inspect the installed command's help/source and intended output paths, then select only Codex and required backend resources:

```powershell
php artisan boost:install
```

Boost generates agent instructions/skills/MCP configuration. Inspect all diffs, including nested `backend/AGENTS.md`, `.codex/`, `boost.json`, or other paths actually reported. Root `AGENTS.md` must never be overwritten or weakened. Generated guidance must follow the project hierarchy; remove duplication only within authorized setup. Do not assume a dry-run flag exists for `boost:install`.

### Codex MCP scope and working directory

Laravel documents this manual fallback, issued from `backend/`:

```powershell
codex.cmd mcp add laravel-boost -- php "artisan" "boost:mcp"
```

**Do not use this fallback by default:** Codex MCP configuration is user-level by default. Running it from `backend/` is not proof of project scope or a durable working directory. Prefer the installer-generated project configuration after inspection, or a reviewed project-local `.codex/config.toml` entry. [Official OpenAI MCP scope and STDIO settings](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

Example for root `lavender-heart/.codex/config.toml`, **created only in later approved setup**; replace the placeholder with the actual backend directory for that checkout:

```toml
[mcp_servers.laravel-boost]
command = "php"
args = ["artisan", "boost:mcp"]
cwd = '<ABSOLUTE_BACKEND_DIRECTORY>'
```

This is machine-specific tooling configuration, not a hardcoded application path. Keep its portability/source-control decision explicit. If configuration is nested under `backend/`, verify discovery from the intended Codex working directory. Trusted project configuration is required; do not weaken trust/sandbox policy to activate it. Global registration is an exception requiring explicit approval. [OpenAI configuration layers](https://learn.chatgpt.com/docs/config-file/config-basic).

Verify with `composer show laravel/boost`, `php artisan list`, and `codex.cmd mcp list`, followed by `/mcp` in the intended session and a harmless framework-documentation/application-info query. MCP visibility is not permission to query private rows or execute arbitrary code. Root instruction hashes/diffs must remain intact. Update resources deliberately with `php artisan boost:update` after checkpoint/source review; do not add automatic Composer update hooks by default.

## 12. Optional DESIGN.md Style Extractor

Source: [bergside/design-md-chrome README](https://github.com/bergside/design-md-chrome).

This is an **optional external Chrome extension**, not a normal Codex Agent Skill. Use only to extract reference typography, colors, spacing, radius, shadows, and motion. It cannot replace Lavender Heart's approved design.

Later manual setup: download the canonical repository into a separate reviewed tools location, inspect the extension manifest/scripts/permissions, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the extension's project folder. No frontend/npm installation is required by this route.

Verify extraction on a public or synthetic page. Downloaded `DESIGN.md`/`SKILL.md` files are reference material only. Rename and save outside authoritative files, for example an approved `references/the-diamond-design-study.md` path. No reference folder/output is created now. Never overwrite root `DESIGN.md`, auto-install generated skills, or clone proprietary assets/compositions.

Updates require reviewing a new upstream snapshot and reloading the extension deliberately. Browser-profile installation and permissions affect browsing outside this repo; do not inspect private content without approval.

## 13. Approved Skill Set

| Category | Approved tooling |
| --- | --- |
| Core / required | Superpowers; UI/UX Pro Max; Hallmark; official GSAP skills; community Three.js/R3F skills; Vercel React Best Practices; Vercel Web Design Guidelines; Impeccable |
| Backend-specific | Laravel Boost |
| Optional external reference tool | DESIGN.md Style Extractor (`design-md-chrome`) |

The Skills CLI and UI/UX CLI are installation transports, not extra approved skill families. Do not add new skills without explicit approval. Avoid installing dozens: Next.js-only, React Native, Vercel deployment, e-commerce, unrelated database/design/content generators, additional animation libraries, and UI frameworks are not required.

## 14. Task-to-Skill Routing

| Task | Minimum relevant tooling |
| --- | --- |
| Requirements / implementation plan | Superpowers |
| TDD / debugging / review / verification | Superpowers |
| React layout / responsive composition | UI/UX Pro Max |
| Reference study / anti-AI-slop review | Hallmark |
| GSAP / ScrollTrigger / horizontal story / parallax | Official GSAP skills |
| Heart / R3F / WebGL | Community Three.js skills |
| React performance | Vercel React Best Practices |
| Accessibility / interface audit | Vercel Web Design Guidelines |
| Laravel API / Sanctum / backend conventions | Laravel Boost + Superpowers |
| Final visual refinement | Impeccable after functionality works |
| External reference extraction | Optional Chrome extractor |

Installed does not mean invoked for every task. Examples: a Laravel validation bug uses Superpowers + Boost; a heart rendering bug uses Superpowers + Three.js; horizontal storytelling uses Superpowers + GSAP plus relevant design guidance; gallery polish uses UI/UX Pro Max + Impeccable after functionality works. Do not flood tasks with every skill.

## 15. Later Installation Order

1. Superpowers.
2. UI/UX Pro Max, subject to bundle review.
3. Hallmark.
4. Official GSAP subset.
5. Community Three.js/R3F subset.
6. Vercel React Best Practices.
7. Vercel Web Design Guidelines.
8. Impeccable and separately reviewed hook consent.
9. Laravel Boost with instruction/configuration protection.
10. Optional Chrome extractor.

Workflow comes first, then visual/reference guidance, specialist skills, and polish. Boost comes later because it generates backend agent configuration. This sequence is setup guidance, not an implementation plan or authorization to execute now. Verify each step before proceeding.

## 16. Project Documentation Precedence

Use the exact hierarchy from `AGENTS.md`:

1. Latest explicit user approval.
2. `PROJECT_CONTEXT.md`.
3. `DESIGN.md`.
4. `AGENTS.md`.
5. Approved implementation plan.
6. Existing code.
7. Skill recommendations.

Skills may advise, review, diagnose, and propose. They may not expand scope, override design, replace architecture, add features, or rewrite authoritative documents. Report/propose conflicting recommendations instead of applying them. Preserve the approval gate, default approved subagent execution, TDD, two-stage review, and verification in `AGENTS.md`.

## 17. Installation Safety

Before later installation/update, confirm canonical owner/repository/package, read README and selected `SKILL.md` files, inspect bundled references/scripts/hooks/binaries and network behavior, check write destinations, review permissions, and preserve `.env`/secrets. Inspect the released payload, not just repository `main`. Avoid commands from untrusted comments/issues and typo-squatted packages.

NPX/npm, Composer plugins/scripts, and skill installers can execute code. A `--list` discovery command avoids skill installation but still launches the installer and may download/cache it; it is not appropriate to run here just because its output is descriptive. No NPX discovery/installer was executed in Phase 4.

Do not use `--yes`, `--all`, wildcard skill selection, global scope, force/overwrite, or security/platform bypass options to avoid review. Pay particular attention to Impeccable's executable hooks/cache, community Three.js payloads, UI/UX bundled siblings, and Boost-generated instructions. Checkpoint known-good state when Git becomes available; inspect diffs before approving executable hooks.

## 18. Private Content Safety

Prefer local processing. Inspect tool behavior before supplying private photos, messages, dates, logs, or screenshots. Do not submit them to external services without explicit approval, include them in skill issues/reports, or leak them through test fixtures. Use synthetic examples for setup verification.

Reference-study tools receive public reference material or approved synthetic inputs. Hosted documentation queries must omit private application payloads. Permission to install a tool does not authorize every network action it offers.

## 19. Codex Skill Paths and Traceability

Paths below are upstream-described destinations, **not claims of completed installation**:

| Installer / tool | Expected scope and destination |
| --- | --- |
| Superpowers | Codex-managed plugin storage; harness-level exception; verify plugin manager rather than guessing a cache path |
| UI/UX Pro Max current Codex template | Project `.agents/skills/ui-ux-pro-max/`; preview any bundled siblings |
| Skills CLI: Hallmark, GSAP, Three.js, Vercel | Project `.agents/skills/<installed-name>/` |
| Hallmark manual alternative | README describes `.codex/skills/hallmark/`; not a second installation alongside CLI |
| Impeccable Codex project install | `.agents/skills/impeccable/`, `.codex/hooks.json`; inspect additional `.impeccable/` configuration/cache effects |
| Laravel Boost | `backend/composer.json`, lock/vendor and generated agent resources; inspect actual reported paths; prefer project `.codex/config.toml` for Codex MCP |
| Chrome extractor | Separate unpacked extension folder/browser profile; approved separate reference output |

The current Skills CLI maps Codex to `.agents/skills/`; official Codex reads repository skills there. Different installers/older releases may use other layouts. Record actual scope, paths, package version, source commit/release when known, identifiers, and hook/MCP trust decisions during later setup. Do not duplicate files across layouts just to make discovery work. [Skills CLI agent paths](https://github.com/vercel-labs/skills/blob/main/src/agents.ts), [official Codex discovery rules](https://learn.chatgpt.com/docs/build-skills).

If the CLI later generates `skills-lock.json` or other traceability metadata, preserve and inspect it, decide source-control suitability, and record the decision. Never fabricate lock contents or create a lock in this phase. Do not assume one lock captures plugin, Composer, CLI, and browser-extension versions alike.

## 20. Verification After Later Installation

For each tool, verify actual paths and Codex discovery in a fresh/reloaded session, compare before/after files, and confirm project scope and absence of unapproved extras. Use synthetic, read-only exercises.

| Tool | Required evidence |
| --- | --- |
| Superpowers | Plugin listed; appropriate brainstorming/planning recognized; no duplicate legacy workflow |
| UI/UX Pro Max | Local `SKILL.md`/assets present, Python search works, Codex sees it; bundle scope reviewed |
| Hallmark | Skill visible; audit/study works without unauthorized edits |
| GSAP | Exactly selected five visible; no competing global/duplicate guidance |
| Three.js | Selected three visible; community source recorded |
| Vercel | Selected React and web-guideline pair visible; identifiers recorded |
| Impeccable | Skill visible; hook definition reviewed/trusted when installed; Windows launcher verified |
| Boost | Composer package/Artisan commands available, MCP usable from intended directory, root `AGENTS.md` preserved, nested instructions reviewed |
| Optional extractor | Extension loads; synthetic/public extraction stays separate from approved design |

Future Skills CLI inspection examples, after checking its current documentation:

```powershell
npx.cmd skills list --agent codex
npx.cmd skills list --global --agent codex
```

These inspect CLI-managed installs, not all plugin/custom-installer state. Codex's actual skill selector is also required. [Skills CLI list commands](https://github.com/vercel-labs/skills#skills-list).

Run relevant project quality checks if setup affects dependency manifests/configuration; Boost requires backend tests, Pint, manifest/platform validation, and a reviewed lock diff. A successful installer exit is not proof that skills load or authoritative files are intact.

## 21. Windows / PowerShell Notes

Use `npm.cmd`, `npx.cmd`, and `codex.cmd` when PowerShell script execution blocks their `.ps1` shims. Primary examples use single-line commands, never Bash `\` continuations. PowerShell multiline commands require backticks with no trailing spaces; single lines are safer here. Quote paths with spaces and confirm the current directory before running installers.

Follow README's existing command-local ZIP workaround when Composer archive installation needs it:

```powershell
php -d extension=zip 'C:\ProgramData\ComposerSetup\bin\composer.phar' require laravel/boost --dev
```

Use that command only for the later approved Boost package step, after confirming the local Composer path. Do not change global PHP configuration or use this machine path in application logic. If symlinks fail, inspect the installer's supported copy method rather than elevating or duplicating skills blindly. Keep `/plugins`, `/skills`, `/hooks`, and `/mcp` inside the Codex interface, not PowerShell.

## 22. Update Policy

Finish/checkpoint the current task, commit known-good state when Git exists, inspect upstream changes, update one selected tool intentionally, review all changed files/permissions, reload Codex as required, and verify behavior. Run relevant project checks when workflow/configuration/dependencies changed. Do not mass-upgrade skills during an unfinished feature.

| Tool | Later update route, rechecked before execution |
| --- | --- |
| Superpowers | Current Codex plugin update mechanism; inspect existing manual copies separately |
| UI/UX Pro Max | Reviewed CLI release, then project `uipro update` via that package; review sibling payloads |
| Hallmark | README permits rerunning selected install; preserve selection/scope |
| GSAP / Three.js / Vercel via Skills CLI | Named-skill update with project scope, after verifying current syntax |
| Impeccable | `npx.cmd impeccable update`; confirm project/provider scope and review/reapprove changed hooks |
| Boost | Targeted reviewed Composer package update as separately authorized; `php artisan boost:update` for generated resources |
| Extractor | Reviewed extension snapshot, reload, synthetic extraction check |

Current Skills CLI supports named updates, for example `npx.cmd skills update hallmark --project`; do not use an all-skills update for routine maintenance. [Skills CLI update documentation](https://github.com/vercel-labs/skills#skills-update).

## 23. Agent Configuration Conflicts

Installers may write `AGENTS.md`, `CLAUDE.md`, MCP settings, hooks, manifests, and other configuration. Inspect diffs, preserve root `AGENTS.md`, and review nested instructions because they can affect backend/frontend work. Keep generated guidance minimal and consistent with the project hierarchy. Ask before replacing an authoritative file; do not overwrite and seek approval afterward.

Do not blanket-ignore the approved root `AGENTS.md` because an installer suggests ignoring regenerated guidelines. Avoid duplicate MCP servers and hooks. An installer wanting additional skills/configuration outside approved scope must stop for review, not silently expand the setup.

## 24. Troubleshooting

Start with current upstream docs → actual path/scope → fresh/restarted Codex → skill discovery → duplicate/global inspection. Do not blindly reinstall everything.

| Symptom | Safe next step |
| --- | --- |
| Skill missing | Inspect `SKILL.md` header, references, actual destination, working directory, and Codex skill selector; restart if needed |
| Different skill directory | Compare installer release/template with current Codex discovery; record the actual path; do not immediately copy into every layout |
| Project/global duplicate | Inspect both sources/versions; avoid double invocation; get approval before removing shared user installs |
| Outdated command / name mismatch | Read current canonical docs and run the documented later `--list`; use actual approved equivalent identifiers |
| UI/UX preview adds sibling skills | Stop before install; inspect bundle and request approval for extras or verify a supported limited route |
| Hook awaiting trust | Read definition/scripts/download behavior, then approve only through Codex `/hooks` if acceptable |
| Boost MCP invisible | Check package, Artisan command, PHP executable, configuration scope/trust, `cwd`, and fresh session `/mcp`; do not add a global duplicate |
| Installer wants to overwrite `AGENTS.md` | Cancel that write, preserve/checkpoint the file, inspect the generation path and propose a safe merge/separate output |
| NPX/Composer network or permission failure | Report the actual error; use approved access/source, not arbitrary mirrors, system changes, or secret-bearing workarounds |

Current names were verified in upstream source, but a future published CLI may expose them differently. Listings were not executed in Phase 4. UI/UX bundled extras and generated installer paths remain later preview/review decisions, not guessed installation results.

## 25. Runtime Dependency Separation

Superpowers, UI/UX Pro Max, Hallmark, GSAP/Three/Vercel agent skills, Impeccable, Boost guidance/MCP, and the extractor are development tooling. They do not require additional frontend runtime packages or public AI features. Boost's explicit `--dev` Composer installation is the backend tooling exception, not a new production capability.

Do not add libraries merely because a skill example references them. Preserve the approved React/Vite/Tailwind, Laravel/Sanctum, TanStack Query/Zustand, GSAP/R3F/Motion/CSS/Lenis architecture. Do not migrate to Next.js, choose a hosting vendor, generate personal production copy, or expand visitor/admin features during tooling setup.

## 26. Phase Boundary

**Phase 4 creates `SKILLS_INSTALL.md` only.** No NPX skill discovery/install/update, plugin installation, Composer package installation, Boost installation, MCP registration, clone, hooks, skill directories, skill locks, Git initialization, branch/worktree, application change, or implementation plan is performed.

`PROJECT_CONTEXT.md`, `DESIGN.md`, `AGENTS.md`, frontend/backend application code, manifests, configurations, migrations, assets, and tests remain unchanged. This guide does not authorize the future installation phase.

**Stop after document creation and review. Wait for explicit approval before the next phase.**
