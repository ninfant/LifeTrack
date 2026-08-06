# Review de LifeTrack — 2026-08-06

Revisión completa de `backend/` y `frontend/` en la rama `design/improve-home-ui`. Ordenado por lo que te va a doler primero.

**Lo bueno, para empezar:** la separación routes → controllers → helpers está limpia, los helpers de rachas son funciones puras (fáciles de testear, y deberías), la migración a React Query quedó bien hecha, el `log-completion` idempotente por día está bien pensado, y hay infra de tests montada en las dos mitades. La base es sólida. Lo que falta es cerrar cabos.

---

## 1. Seguridad

### 1.1 — Token de GitHub en texto plano en `.git/config` 🔴

Tu remote es `https://ghp_XXXX@github.com/ninfant/LifeTrack.git`. El PAT está guardado en claro en `.git/config`. No se sube al repo, pero cualquiera con acceso a tu disco (o a un backup, o a una captura de pantalla) lo tiene. **Además acaba de aparecer en el output de esta sesión.**

**Rótalo hoy** en github.com/settings/tokens y pásate a SSH o al credential helper del sistema:

```bash
git remote set-url origin git@github.com:ninfant/LifeTrack.git
# o, si prefieres HTTPS:
git config --global credential.helper osxkeychain
git remote set-url origin https://github.com/ninfant/LifeTrack.git
```

### 1.2 — `.env` commiteados en un repo público 🟠

`ninfant/LifeTrack` es **público**, y `backend/.env` y `frontend/.env` están trackeados desde el commit `935740b`. La suerte que tienes es que hoy el `MONGO_URI` es `mongodb://localhost:27017`, sin credenciales. Pero el día que pases a Atlas y hagas commit, la contraseña se publica sola.

```bash
git rm --cached backend/.env frontend/.env
# y crea backend/.env.example y frontend/.env.example con las claves vacías
```

Ya tienes `.env` en el `.gitignore` de la raíz; el problema es que git ignora esa regla para archivos que ya están en el índice.

### 1.3 — Contraseñas sin hashear

[userController.js:13](backend/controllers/userController.js#L13) guarda `password` tal cual llega. Necesitas `bcrypt` en un hook `pre("save")` del modelo.

### 1.4 — `getAllUsers` publica todas las contraseñas

[userController.js:22](backend/controllers/userController.js#L22) hace `User.find()` sin proyección → devuelve el array completo de usuarios **con el campo password**, en un endpoint público sin auth. Mínimo `.select("-password")`, e idealmente ese endpoint no debería existir.

### 1.5 — No hay autenticación, en ningún lado

Ningún endpoint valida nada. Consecuencias reales hoy:
- Cualquiera puede leer los hábitos de otro con `GET /api/habits/getall/:userId`
- Cualquiera puede borrar o editar un hábito ajeno si conoce el `_id`
- `api.ts` manda un `Authorization: Bearer <token>` de `localStorage`, pero el backend **nunca lo mira**, y nada escribe ese token nunca

Esto es lo que separa "proyecto de práctica" de "proyecto que enseño en una entrevista". Ver el plan en §4.

### 1.6 — Los errores internos se filtran al cliente

En `habitsController.js` casi todos los catch hacen `res.status(500).json({ message: "...", error })` — eso serializa el error de Mongoose hacia el navegador. `logHabitCompletion` además devuelve `error.message` y `errorName`. Loguea el detalle en el servidor, devuelve un mensaje genérico.

---

## 2. Bugs funcionales

### 2.1 — El Dashboard está siempre vacío 🔴

[Dashboard.tsx:6](frontend/src/pages/Dashboard/Dashboard.tsx#L6) lee el userId de Redux:

```ts
const userId = useSelector((state: RootState) => (state as any).user?.id);
```

Pero **`setUser` no se despacha en ninguna parte del proyecto** (lo confirmé con un grep sobre todo `src/`). `state.user.id` es `null` siempre → `useHabits("")` queda deshabilitado → `habits` es `[]` → la página siempre muestra "No tienes hábitos aún", tengas los que tengas.

Arreglo rápido: leer el userId igual que `App.tsx`. Arreglo bueno: `App.tsx` despacha `setUser` cuando llega la respuesta del usuario, y todo el mundo lee de ahí.

### 2.2 — El Profile está siempre vacío 🔴

[App.tsx:34](frontend/src/App.tsx#L34) le pasa a `Profile` el objeto que devuelve la API, que es un documento de Mongo serializado a JSON: trae **`_id`**, no `id` (Mongoose tiene un virtual `id`, pero `toJSON` no incluye virtuals por defecto). Y [Profile.tsx:14](frontend/src/pages/Profile/Profile.tsx#L14) hace `user?.id ? ... : ...` → siempre cae en el else, "No hay información de usuario".

### 2.3 — HabitDetail muestra un campo que no existe

[HabitDetail.tsx:27](frontend/src/pages/Habits/HabitDetail.tsx#L27) pinta `habit.habitbyid.description`. El modelo `Habits` no tiene `description` — tiene **`objective`**. Se quedó del refactor `5f1e0b7`. El párrafo sale vacío siempre.

### 2.4 — `npm test` del backend falla 🟠

```
✕ debe crear un hábito exitosamente
Expected: {"description": "30 minutos diarios", "name": "Hacer ejercicio", "userId": "123"}
Number of calls: 0
```

Mismo origen que el anterior: el test espera `create({name, description, userId})` pero el controller ahora exige y manda `{name, category, objective, userId}`, y como falta `category` corta antes con un 400. Actualiza el test — es de dos líneas.

### 2.5 — Bug de zona horaria latente 🟠

El front manda la fecha como `"2026-08-06"` ([habitHelpers.tsx:2](frontend/src/helpers/habitHelpers.tsx#L2)) y el back hace `new Date("2026-08-06")` → eso es medianoche **UTC**, y luego `setHours(0,0,0,0)` la lleva a medianoche **local**.

En tu máquina (UTC+3) el resultado es Aug 6 y todo cuadra. Para cualquier usuario en América (UTC−) `new Date("2026-08-06")` cae en la tarde del **5 de agosto local**, y se guarda el día equivocado. Las rachas salen mal y nadie entiende por qué.

Arreglo: parsea el `YYYY-MM-DD` a mano en el backend en vez de dejárselo al constructor de `Date`.

```js
const [y, m, d] = str.split("-").map(Number);
return new Date(y, m - 1, d);   // medianoche local, siempre el día correcto
```

### 2.6 — La racha se pone a 0 apenas empieza el día

[calculateStreaks](backend/helpers/habitsHelpers.js#L31) arranca en hoy y corta en el primer día no completado. Si llevas 30 días seguidos y hoy son las 9 de la mañana, la app te dice **0**. Es demoledor para la motivación, que es justo el punto de la app.

Lo habitual: si hoy no está marcado, empieza a contar desde ayer (y solo se rompe la racha cuando ayer tampoco está).

### 2.7 — Se pueden marcar días futuros

[HabitCalendar.tsx](frontend/src/components/habits/HabitCalendar/HabitCalendar.tsx) pinta todos los días del mes y todos son clicables. Estamos a 6 de agosto y puedes marcar el 31 como completado, lo que infla las estadísticas y la racha más larga. Deshabilita `date > today`.

### 2.8 — El `if` de "no hay hábitos" es código muerto

[habitsController.js:30](backend/controllers/habitsController.js#L30): `if (!allhabits)` nunca se cumple — `Model.find()` devuelve `[]`, no `null`. Que responda 200 con array vacío está bien (es lo correcto), pero borra el 404 para que no confunda. Mismo patrón, ojo, en cualquier `find()` futuro.

### 2.9 — El mensaje de error del front nunca aparece

[HabitsList.tsx:69](frontend/src/pages/Habits/HabitsList.tsx#L69): `(error as any)?.data?.message` es la forma de RTK Query. Con React Query el error es un `Error` normal, así que `.data` es `undefined` y siempre se ve el texto genérico. Es `error.message`.

### 2.10 — Condición de carrera en `log-completion`

[logHabitCompletion](backend/controllers/habitsController.js#L89) hace `findById`, modifica el array en memoria, y luego `$set` del array **entero**. Dos clicks rápidos (o dos pestañas) y el segundo pisa al primero. Con un update posicional resuelves esto y encima te ahorras un viaje a la base:

```js
// intenta actualizar el día existente; si no existe, $push
await Habits.updateOne(
  { _id: id, "completions.date": completionDate },
  { $set: { "completions.$.completed": value } }
);
```

### 2.11 — `createUser` valida fuera del try

[userController.js:8](backend/controllers/userController.js#L8): el `findOne` está antes del `try`. Si Mongo no responde, ese await lanza fuera del catch. Express 5 lo recoge y devuelve un 500 genérico, así que no se cae el server, pero es inconsistente con el resto del archivo.

---

## 3. Arquitectura y limpieza

### 3.1 — Decide qué haces con Redux

Ahora mismo Redux está instalado, montado en `main.tsx` y **no hace absolutamente nada**: `habitsSlice` tiene dos campos que nadie lee, `userSlice` nunca se despacha, y `store/features/auth/` son tres archivos `.js` cuyo contenido íntegro es un comentario de una línea.

Dos caminos válidos, elige uno:
- **Terminarlo**: despacha `setUser` en `App.tsx` y arreglas 2.1 y 2.2 de paso. Redux queda para el estado de UI/sesión, React Query para el server state. Es una separación defendible.
- **Borrarlo**: quita `@reduxjs/toolkit` y `react-redux`, el `Provider`, y toda la carpeta `store/`. Pasa el userId por contexto de React. Menos dependencias, menos que explicar.

Yo iría por **terminarlo**, porque cuando metas login vas a necesitar dónde guardar la sesión igual.

### 3.2 — Archivos que sobran, varios trackeados en git

| Archivo | Qué es |
|---|---|
| `backend/node` | 0 bytes, un `>` mal tipeado en la terminal. Está en git. |
| `backend/backend@1.0.0` | 0 bytes, lo mismo. Está en git. |
| `backend/jest-report/report.html` | build artifact; está en `.gitignore` pero ya estaba trackeado |
| `frontend/src/App.css` | 37 líneas, nadie lo importa |
| `frontend/src/styles/globals.css` | 1 línea, nadie lo importa |
| `frontend/src/store/features/auth/*.js` | 3 archivos, solo comentarios |
| `frontend/tailwind.config.js` | Tailwind v4 no lo lee (§3.5) |
| `dotenv` en `frontend/package.json` | Vite ya carga los `.env`, no hace falta |

### 3.3 — Tipos: faltan, y sobran los `any`

No hay un `src/types/`. Cada componente redeclara la forma del hábito o directamente pone `any` (`habit: any`, `completion: any`, `(state as any).user`). Estás pagando TypeScript sin recibir nada.

Un `src/types/habit.ts` con `Habit`, `Completion`, `User` y los tipos de respuesta de la API te habría cazado 2.2 y 2.3 en el editor, gratis, antes de ejecutar nada.

### 3.4 — Nombres de respuesta inconsistentes en la API

`allhabits`, `habitbyid`, `newhabit`, `updatedhabit`, `deletedhabit`, `user`, `users`. Siete nombres para lo mismo. El front tiene que recordar cuál toca en cada llamada, y `habit.habitbyid.name` no se lee bien en ningún idioma.

Unifica en `{ message, data }`. Es un cambio mecánico y toca poco código ahora — cada mes que pase toca más.

### 3.5 — La config de Tailwind no se está aplicando

`index.css` hace `@import "tailwindcss"` (sintaxis v4), pero `tailwind.config.js` está en formato v3 y **v4 no lo carga** salvo que pongas una directiva `@config`. Las animaciones `fade-in` y `slide-up` que definiste ahí no existen en el CSS generado — y tampoco las usa ningún componente, así que ni te enteraste. Muévelas a `@theme` en el CSS o borra el archivo.

### 3.6 — Detalles sueltos

- **`userId` hardcodeado** en [App.tsx:13](frontend/src/App.tsx#L13) (`"6911080679130dcd6c8c0d2b"`). Desaparece cuando haya login.
- **`get-stats` está implementado y nadie lo llama.** Es tu endpoint más completo (rachas + progreso semanal/mensual + tasa global) y el Dashboard recalcula a mano una versión peor. Conéctalo.
- **`Button` está construido y testeado, y no se usa en ningún sitio.** Todas las páginas escriben las clases Tailwind a mano, con colores distintos para la misma acción. Úsalo o bórralo.
- **Express sin middleware de errores ni handler 404.** Un `app.use((err, req, res, next) => ...)` al final te deja quitar la mitad de los try/catch.
- **`alert()` y `window.confirm()`** para errores y confirmaciones. Funciona; queda a medio camino del cuidado que le pusiste al Home.
- **Idiomas mezclados en la UI**: Home y HabitsList en inglés, Dashboard/Profile/HabitDetail y el Header ("Hábitos", "Perfil") en español. Elige uno.
- **Sin README en la raíz** y sin `.env.example` — nadie más puede arrancar esto sin preguntarte.
- **Espaciado del Header peleándose**: el `<nav>` tiene `mb-8 ml-8` y debajo hay un div de gradiente de 80px de alto, lo que obliga al Home a compensar con `pt-52 md:pt-64` sobre un contenedor que ya tenía `pt-20 md:pt-32`. Son cuatro paddings discutiendo. Deja que el Layout gestione el offset del header, una sola vez.
- **La preview del Home es data falsa** ("Drink water", "Streak: 7 days"). Para un landing está perfecto — solo que no acabe pareciendo la app real.
- `console.log` de depuración en `logHabitCompletion` (líneas 114, 125, 146).

---

## 4. Plan para terminarlo

Ordenado por retorno. Los tres primeros bloques te dejan una app que **funciona de verdad** y que se puede enseñar.

### Bloque 1 — Higiene y bugs rotos (una tarde)

1. Rotar el PAT y cambiar el remote a SSH — **§1.1, hoy**
2. `git rm --cached` de los dos `.env`, crear los `.env.example` — §1.2
3. Borrar los archivos basura de §3.2
4. Arreglar el Dashboard (§2.1) y el Profile (§2.2) — la app deja de estar medio muerta
5. `description` → `objective` en HabitDetail — §2.3
6. Arreglar el test del backend — §2.4
7. Quitar los `console.log` y dejar de devolver el objeto `error` al cliente — §1.6

### Bloque 2 — Que los datos sean correctos (un día)

8. Parseo de fechas sin UTC — §2.5
9. Racha que tolera "hoy todavía no" — §2.6
10. Bloquear días futuros en el calendario — §2.7
11. Update posicional en `log-completion` — §2.10
12. **Tests de `habitsHelpers.js`** — son funciones puras, es el sitio más fácil y más rentable para testear de todo el proyecto, y es exactamente donde viven los bugs 2.5 y 2.6. Es también la respuesta a la pregunta que dejaste escrita al final de `formatStreak.ts`: sí, se testea en los dos lados, y el backend es donde más falta hace porque ahí está la lógica de negocio.

### Bloque 3 — Autenticación (dos o tres días)

13. `bcrypt` en un `pre("save")` de User, y `select("-password")` en todas las lecturas
14. `POST /api/users/login` que devuelve un JWT
15. Middleware `requireAuth` que verifica el token y pone `req.userId`
16. Aplicarlo a **todas** las rutas de hábitos, y filtrar siempre por `req.userId` en vez de por el `:userId` de la URL — esto es lo que cierra el agujero de §1.5
17. Páginas de Login y Registro; guardar el token, despachar `setUser`, y adiós al userId hardcodeado
18. Borrar `getAllUsers`

### Bloque 4 — Calidad (continuo)

19. `src/types/` y quitar los `any` — §3.3
20. Unificar las respuestas de la API en `{ message, data }` — §3.4
21. Conectar `get-stats` al Dashboard — §3.6
22. Middleware de errores en Express — §3.6
23. Usar el `Button` o borrarlo; unificar el idioma de la UI
24. Arreglar el espaciado Header/Home y limpiar `tailwind.config.js` — §3.5
25. README en la raíz

### Si quieres que luzca (opcional)

- Vista semanal en el calendario, no solo el mes actual
- Gráfico de progreso con el `get-stats` que ya tienes
- Deploy: front en Vercel, back en Render, Mongo en Atlas (**después** del bloque 1, no antes)

---

## Resumen en una línea

La arquitectura está bien y la lógica de rachas está mejor de lo que suele estar en un proyecto de este tamaño. Lo que falta es cerrar: **dos páginas de cuatro no muestran datos por un `id` que nunca se rellena**, no hay autenticación, y hay credenciales donde no deben. El bloque 1 son unas horas y cambia por completo la sensación de la app.
