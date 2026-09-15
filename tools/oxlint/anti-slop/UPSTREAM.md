# anti-slop provenance

- **Source:** the `install-anti-slop` skill bundle (`~/.agents/skills/install-anti-slop`), copied with its `scripts/install.mjs` on 2026-09-14.
- **Upstream repository and commit:** unknown. The bundle was not a git checkout and carried no version file.
- **Installed paths:** `tools/oxlint/anti-slop/` (generic rules in `rules/`, shared helpers in `shared/`, the opt-in Effect plugin in `effect/`, and the vendored Stylistic rule in `vendor/eslint-stylistic/` with its own `LICENSE` and `UPSTREAM.md`).
- **Dependency:** none. Rules import the plugin API from `vite-plus/lint/plugins` (Vite+ 0.3.2+), so it matches the Vite+ install.

## Deviations

- The Effect plugin is copied but not registered, since the portfolio does not depend on `effect`.
- Every `@oxlint/plugins` import points to `vite-plus/lint/plugins` instead.
- No rule logic was changed. All 18 generic rules and `oxc/no-accumulating-spread` are enabled at `error` in `vite.config.ts` with default options.
