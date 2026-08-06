# LifeTrack

App de seguimiento de hábitos. Monorepo simple: `backend/` (Express + MongoDB) y `frontend/` (React + Vite). Sin workspaces ni scripts en la raíz — cada mitad se arranca por separado.

## Arrancar

```bash
# terminal 1 — necesita MongoDB local en :27017
cd backend && npm install && npm run dev      # nodemon, puerto 3000

# terminal 2
cd frontend && npm install && npm run dev     # vite, puerto 5173
```

Variables de entorno (hoy commiteadas, ver `REVIEW.md` §1):
- `backend/.env` → `MONGO_URI`
- `frontend/.env` → `VITE_API_URL`

CORS en [server.js](backend/server.js) está fijado a `http://localhost:5173`.

## Tests

```bash
cd frontend && npm run test:run     # vitest — 17 tests, pasan
cd backend  && npm test             # jest ESM — 2 tests, 1 FALLA (test desactualizado)
```

Jest corre con `--experimental-vm-modules` porque el backend es ESM (`"type": "module"`).

## Backend — `backend/`

Express 5, Mongoose 8, ESM. Sin capa de servicios: las rutas llaman directo a los controllers, y los controllers a los modelos.

```
server.js              app + CORS + connectDB()
config/db.js           conexión Mongo, process.exit(1) si falla
Models/User.js         name, email (unique), password  ← password en texto plano
Models/Habits.js       name, category, objective, userId, completions[{date, completed}], createdAt
routes/                habitsRoutes.js, userRoutes.js
controllers/           habitsController.js, userController.js
helpers/habitsHelpers.js   toda la lógica de rachas/progreso (sin tests)
```

**No hay autenticación.** No hay middleware, ni JWT, ni bcrypt. Todos los endpoints son públicos.

### Endpoints

| Método | Ruta | Notas |
|---|---|---|
| POST | `/api/users/create` | guarda la password sin hashear |
| GET | `/api/users/getallusers` | devuelve todos los users **con password** |
| GET | `/api/users/getuserbyid/:id` | |
| POST | `/api/habits/create` | |
| GET | `/api/habits/getall/:userId` | |
| GET | `/api/habits/get/:id` | |
| PUT | `/api/habits/update/:id` | |
| DELETE | `/api/habits/delete/:id` | |
| POST | `/api/habits/log-completion/:id` | body `{date?, completed}`, hace toggle idempotente por día |
| GET | `/api/habits/get-streak/:id` | solo rachas |
| GET | `/api/habits/get-stats/:id?period=week\|month` | rachas + progreso + global — **el front no lo usa** |

**Convención de respuestas: inconsistente.** Cada endpoint bautiza distinto el payload — `allhabits`, `habitbyid`, `newhabit`, `updatedhabit`, `deletedhabit`, `user`, `users`. Al tocar el front hay que mirar el controller para saber la clave.

### Modelo de completions

`completions` es un array embebido de `{date, completed}`, **un registro por día**, con la fecha normalizada a medianoche. `log-completion` busca el índice del día y actualiza en sitio, o hace push si no existe. Un `completed: false` es un registro real (día desmarcado), no una ausencia — los helpers filtran por `completed === true`.

### Helpers de cálculo

Todo en [habitsHelpers.js](backend/helpers/habitsHelpers.js), funciones puras que reciben las completions ya normalizadas:
- `normalizeDate` → medianoche **local**
- `normalizeCompletions` → añade `dateTime` (epoch ms) para comparar por igualdad
- `getCompletedDates` → solo los `dateTime` completados, orden descendente
- `calculateStreaks` → racha actual (camina hacia atrás desde hoy con un `Set`) y la más larga
- `calculateProgress` → ventana de 7 o 30 días
- `calculateOverallStats` → total, edad del hábito en días, tasa de completitud

## Frontend — `frontend/`

React 19 + TypeScript + Vite 7 + Tailwind **v4** + React Router 7.

```
src/App.tsx            rutas + carga del usuario (userId hardcodeado)
src/main.tsx           QueryClientProvider > redux Provider > App
lib/react-query.ts     staleTime 5min, refetchOnWindowFocus off
src/services/api.ts    wrapper de fetch, mete Bearer token de localStorage
src/services/          habitsService.ts, userService.ts — un método por endpoint
src/hooks/             useHabits.ts, useUsers.ts — los wrappers de React Query
src/pages/             Home, Habits (List + Detail), Dashboard, Profile
src/components/        layout/, habits/HabitCalendar, common/Button
src/store/             Redux — ver abajo
```

### Estado: React Query manda, Redux es residuo

El server state vive **entero** en React Query. Redux quedó de un refactor anterior (RTK Query → React Query) y hoy no aporta nada:
- `habitsSlice` — `selectedHabitId` y `filterHabits`, ninguno se lee ni se despacha
- `userSlice` — `setUser` **nunca se despacha**, así que `state.user.id` es siempre `null` (esto rompe el Dashboard, ver `REVIEW.md` §7)
- `store/features/auth/*.js` — tres archivos que son solo una línea de comentario

Query keys en uso: `["habits", userId]`, `["habit", id]`, `["habit-streak", id]`, `["user", id]`. Las mutaciones invalidan por esas keys.

### Tailwind v4

`src/index.css` hace `@import "tailwindcss"` y PostCSS usa `@tailwindcss/postcss`. **`tailwind.config.js` no se lee** — en v4 la config va en CSS con `@theme`, y no hay directiva `@config`. Las animaciones `fade-in` / `slide-up` definidas ahí son código muerto (tampoco se usan en ningún componente).

## Convenciones observadas

- Comentarios y strings de UI **en español**; nombres de código en inglés. Mezclado — algunas páginas están en inglés (`HabitsList`, `Home`), otras en español (`Dashboard`, `Profile`, `HabitDetail`).
- Componentes: `export default`, arrow function, un archivo por componente en su propia carpeta.
- Tests en `__tests__/` junto al código que prueban.
- Tailwind inline, sin variantes extraídas. El componente `Button` existe y está testeado pero **ningún lado lo usa**.
