# FoodFlow Backend (Express + MongoDB)

Migrated from Spring Boot (Java) to Node.js/Express, with MongoDB replacing SQL Server.

## Setup

1. Install MongoDB locally (https://www.mongodb.com/try/download/community) and make sure
   `mongod` is running, **or** create a free cluster on MongoDB Atlas and copy its connection
   string. No manual database/table creation needed - MongoDB creates the database and
   collections automatically the first time data is written.
2. Copy `.env.example` to `.env` and fill in your real values (in particular `MONGODB_URI`):
   ```
   cp .env.example .env
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run in dev mode (auto-restarts on file changes):
   ```
   npm run dev
   ```
   or for a plain run:
   ```
   npm start
   ```

On first boot, the server automatically creates the database tables (`sequelize.sync`) and seeds
one admin account using `ADMIN_USERNAME` / `ADMIN_PASSWORD` from your `.env`. There is no public
signup route — that's the only way an admin account gets created.

## Admin login

```
POST /api/admin/login
Body: { "username": "admin", "password": "changeme123" }
Response: { "token": "<jwt>" }
```

Use the token on protected routes:
```
Authorization: Bearer <jwt>
```

## Route map (what's public vs admin-only)

| Method | Route                          | Access |
|--------|---------------------------------|--------|
| GET    | /api/restaurants                | public |
| GET    | /api/restaurants/:id             | public |
| POST   | /api/restaurants                | admin  |
| DELETE | /api/restaurants/:id             | admin  |
| GET    | /api/menu                       | public |
| GET    | /api/menu/restaurant/:id         | public |
| POST   | /api/menu                       | admin  |
| PUT    | /api/menu/:id                   | admin  |
| DELETE | /api/menu/:id                   | admin  |
| POST   | /api/orders                     | public (customers place orders without login) |
| GET    | /api/orders                     | admin  |
| PUT    | /api/orders/:id/status           | admin  |
| POST   | /api/admin/login                | public |
| GET    | /api/admin/me                   | admin  |
| GET    | /api/orders/:id                 | public (customer tracks their own order by id) |

## Live order tracking (WebSockets)

The server runs a socket.io instance alongside the REST API on the same port. This extends
the existing **Observer** pattern (`src/observers/orderNotifier.js`) with a second listener:

- `src/observers/orderStatusLogger.js` - logs status changes to the console (original behavior)
- `src/observers/orderSocketBroadcaster.js` - **new** - pushes the same status change over a
  WebSocket to any browser currently watching that specific order

**Client usage:**
```js
import { io } from 'socket.io-client'
const socket = io('http://localhost:8080')

socket.emit('joinOrder', orderId)       // subscribe to updates for one order
socket.on('orderUpdate', ({ orderId, status, estimatedMinutes }) => {
  // update UI live, no polling/refresh needed
})
```

Each order also carries a real `estimatedMinutes` field (see `src/utils/etaCalculator.js`),
computed from actual kitchen queue depth at that restaurant plus the delivery leg time - not
a hardcoded number. It's recalculated whenever the order's status changes.

If you want any of these access levels changed, it's a one-line edit in the matching file
under `src/routes/`.

## Design patterns preserved from the Java version

- **Strategy** — `src/strategies/deliveryFeeStrategy.js` (standard vs express delivery fee rules)
- **Observer** — `src/observers/orderNotifier.js` + `orderStatusLogger.js` (built on Node's
  built-in `EventEmitter`, which *is* the Observer pattern in the standard library)
- **Factory** — `src/factories/orderFactory.js` (centralizes order object construction)
- **Facade** — `src/services/orderService.js` still hides the Factory/Strategy/Observer wiring
  behind two simple methods, same as the original

## Folder structure

```
src/
  config/db.js          - Mongoose connection (replaces application.properties datasource)
  models/                - Mongoose schemas (replaces JPA @Entity classes)
  repositories/          - Thin data-access wrappers (replaces JpaRepository interfaces)
  services/               - Business logic (replaces @Service classes)
  controllers/            - Request handlers (replaces @RestController classes)
  routes/                 - Express routers (replaces @RequestMapping)
  middleware/             - Auth + error handling (new - Java version had none)
  factories/, observers/, strategies/  - the three design patterns
  server.js               - App entry point (replaces BackendApplication.java)
```

## Notes / things worth double-checking

- `items` on an order is still stored as a plain string field, same as the Java version. If your
  frontend actually sends an array of items, consider switching this to an array field later —
  didn't change it here to keep behavior identical to the original.
- **IDs are now MongoDB ObjectIds (strings like `"66f1a2b3c4d5e6f7a8b9c0d1"`), not auto-incrementing
  numbers.** If your React frontend has any hardcoded numeric restaurant/menu IDs, they'll need
  updating once you seed real data. The JSON responses still use the key `id` (not `_id`) to keep
  the shape familiar — see `src/utils/idTransform.js`.
- No schema migrations needed - MongoDB is schemaless at the database level, Mongoose only
  enforces structure at the application layer. Good for fast iteration on a course project.
- A free MongoDB Atlas cluster (no local install needed) is the fastest way to get running if
  you don't want to install MongoDB locally.
