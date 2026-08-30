# AGENTS.md

React + Vite (JSX, no TypeScript) online book & stationery store. `/data/db.json` is a mock JSON database; all data is fetched via axios from `http://localhost:3000`.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint (flat config: `eslint.config.js`)
- No test framework or CI. `preview` compiles via `vite preview`.

## Backend (critical)

The app talks to a `json-server` backend on port 3000, but **json-server is NOT a dependency and there is no npm script for it**. Run it manually before `npm run dev`:

```
npx json-server data/db.json
```

Without it, all axios calls to `http://localhost:3000/*` fail. Backend URLs are hardcoded in each component (e.g. `src/Pages/Login.jsx:16`, `src/Admin/AdminProducts.jsx:13`) — there is no API abstraction layer.

## Structure

- `src/AllRoutes.jsx` — single source of truth for all routes (user + admin). Add new pages here.
- `src/App.jsx` — renders the user `Navbar` only when the path does NOT start with `/admin`. Admin pages get their own layout via `src/Admin/`.
- User pages in `src/Pages/`, admin pages in `src/Admin/`, per-page CSS in `src/styles/*.css` (imported per component).
- Redux: `src/Redux/Store.jsx` (cart slice only). Note: slice/store files use `.jsx` extension even though they contain no JSX — follow this convention.

## Gotchas / dead code

- `src/Pages/UserRegister.jsx` is an unused duplicate of the routed `src/Pages/Register.jsx` (which posts to `/users`). Prefer editing `Register.jsx`.
- Admin auth uses the DB: `AdminLogin`/`AdminRegister` (`src/Admin/AdminLogin.jsx`, `src/Pages/AdminRegister.jsx`) talk to the `admin` collection (singular) in `data/db.json`. Seeded admin creds: `admin@gmail.com` / `admin123`.
- `data/db.json` `$schema` points to `./node_modules/json-server/schema.json`, which doesn't exist locally — harmless.
- Auth images live in `public/images/` as `.svg` (`login.svg`, `register.svg`) — referenced from `Login.jsx` / `Register.jsx`.
- Cart state lives only in Redux in-memory (`CartSlice.jsx`); the Cart page's "Checkout" just clears the cart and does not persist an order to the backend. Persisting orders is not yet implemented.
- Admin pages are wrapped in `AdminLayout` (shared sidebar) via a layout route in `AllRoutes.jsx`. The sidebar links to all admin pages; each admin page fetches/edits `http://localhost:3000/*` directly.
