# Uniflow

Unified campus tooling powered by Create React App. This build now includes the full canteen experience for both students and the single canteen admin.

## Getting Started

```bash
npm install
npm start
```

The React dev server runs at http://localhost:3000. The API (Express + MongoDB) runs separately from `/server` on port 5000 by default.

Set the API base URL (optional) in `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Other Scripts

- `npm test` – run the CRA test watcher.
- `npm run build` – create a production bundle inside `build/`.

## Canteen Module

Routes:

- `/canteen` – Student view. Shows only items where `available` and `isToday` are true.
- `/canteen-admin` – Admin inventory & menu builder protected by demo credentials. Data persists in MongoDB via the Node server (`server/server.js`).

Admin credentials:

- **Email:** `dasininima@gmail.com`
- **Password:** `dasini`

Logging in stores an admin session in `localStorage`. Use the top-right logout button (or the page-level button) to clear that session and return to the main login screen.

Key features:

- 20 seeded Sri Lankan dishes with local thumbnails under `src/assets/food/`.
- Two-pane admin dashboard backed by the API with search, category filter, summary counters, inline editing, add-item modal, delete confirmation, and today’s checklist.
- Student grid with responsive cards, emoji badges, and friendly empty state – automatically reflects the admin’s “Today’s Menu”.
- Toast notifications for CRUD actions and today’s menu toggles.
- `src/store/canteenStore.ts` fetches & mutates data through the API (`/api/canteen`).

## Tech Stack Highlights

- React 19 with React Router 7.
- Node/Express + MongoDB (Mongoose) API for canteen items and hostel notices.
- Lucide icons, custom CSS, and image fallbacks for consistent visuals.
- Toast context/provider to surface action feedback globally.

Feel free to adapt the data layer to a real API by swapping the logic inside `src/store/canteenStore.ts`.
