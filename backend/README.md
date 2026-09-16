# SMSVerifyKh - HERO SMS API Backend Service

A production-ready RESTful API backend that acts as a proxy/middleware layer for the HERO SMS public API, providing SMS number rental, verification, and management capabilities.

## Objective

This service exposes a clean, versioned REST API (V1/V2/V3) that proxies requests to the HERO SMS API (`handler_api.php`). It adds authentication middleware, rate limiting, structured logging, input validation, and error handling on top of the upstream API.

## Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Runtime          | Node.js 18+ (LTS)           |
| Language         | JavaScript (ES Modules)      |
| Framework        | Express.js 5.x               |
| Database         | MySQL (mysql2/promise)       |
| Validation       | Joi                          |
| Logging          | Winston + Morgan             |
| Security         | Helmet, CORS, Rate Limiting  |
| Environment      | dotenv                       |
| Dev Tools        | Nodemon                      |
| Build            | esbuild                      |

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL** running on port 3307 (or update `.env`)
- A valid **HERO SMS API Key** from https://hero-sms.com

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
# HERO_SMS_API_KEY=your_real_key
```

## Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development

HERO_SMS_BASE_URL=https://hero-sms.com
HERO_SMS_API_KEY=YOUR_API_KEY

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=smsverify-kh

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Running

```bash
# Development (with hot-reload)
npm run dev

# Production (from source)
npm start

# Build for deployment
npm run build

# Production (from build)
npm run start:prod
```

## Project Structure

```
backend/
├── .env                    # Environment variables (git-ignored)
├── .env.example            # Template for .env
├── package.json
├── esbuild.config.js       # Build configuration
├── src/
│   ├── app.js              # Express app initialization
│   ├── server.js           # Server entry point
│   ├── config/
│   │   ├── env.js          # Environment config loader
│   │   ├── database.js     # MySQL connection pool
│   │   └── heroSms.js     # HERO SMS API config
│   ├── routes/
│   │   ├── index.js        # Route aggregator (/api/auth, /api/user, /api/v1..v3)
│   │   ├── auth.routes.js  # Register / login / refresh (JWT)
│   │   ├── user.routes.js  # Profile, wallet, activations (protected)
│   │   ├── v1.routes.js    # V1 API routes (protected)
│   │   ├── v2.routes.js    # V2 API routes (protected)
│   │   └── v3.routes.js    # V3 API routes (protected)
│   ├── controllers/
│   │   ├── v1.controller.js
│   │   ├── v2.controller.js
│   │   └── v3.controller.js
│   ├── services/
│   │   └── hero-sms.service.js  # HERO SMS API client
│   ├── middleware/
│   │   ├── error-handler.js      # Global error handler
│   │   ├── async-wrapper.js      # Async error catcher
│   │   └── validation.js         # Joi validation middleware
│   ├── errors/
│   │   └── AppError.js           # Custom error classes
│   ├── utils/
│   │   └── logger.js             # Winston logger
│   └── log/                      # Log files directory
└── dist/                         # Build output (generated)
```

## Data Flow

```
Client Request
      │
      ▼
  src/app.js           ← Express, Helmet, CORS, Rate Limit
      │
      ▼
  src/routes/index.js  ← Route aggregator (/api/v1, /api/v2, /api/v3)
      │
      ▼
  src/routes/vX.routes.js  ← Route definitions (HTTP method + path)
      │
      ▼
  src/controllers/vX.controller.js  ← Request parsing, response formatting
      │
      ▼
  src/services/hero-sms.service.js  ← Business logic, HERO SMS API calls
      │
      ▼
  HERO SMS API (https://hero-sms.com/stubs/handler_api.php)
```

## API Endpoints

### Authentication (JWT)

All routes except `/health` and `/api/auth/*` require an **access token**.

Get a token by registering or logging in, then send it as:
`Authorization: Bearer <accessToken>`

A **refresh token** is returned too — use `/api/auth/refresh` before it expires
(access token default lifespan: `7d`, refresh: `30d` — configurable in `.env`).

| Method | Endpoint                | Body / Params                         | Description                          |
| ------ | ----------------------- | ------------------------------------- | ------------------------------------ |
| POST   | `/api/auth/register`    | `username`, `email`, `password`       | Create account → `{ accessToken, refreshToken }` |
| POST   | `/api/auth/login`       | `email`, `password`                   | Login → `{ user, accessToken, refreshToken }`    |
| POST   | `/api/auth/refresh`     | `refreshToken`                        | Issue a new token pair                          |
| GET    | `/api/auth/me`          | — (Bearer token)                      | Current user profile (protected)                |

Example:

```bash
# 1) Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","email":"demo@example.com","password":"Secret123!"}'

# 2) Use the accessToken
curl http://localhost:5000/api/v1/getBalance \
  -H "Authorization: Bearer <accessToken>"
```

### User Endpoints (protected)

Base URL: `/api/user` — all require `Authorization: Bearer <accessToken>`.

| Method | Endpoint                     | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/profile`                   | View profile                          |
| PUT    | `/profile`                   | Update username / email               |
| POST   | `/change-password`           | Change password (`oldPassword`, `newPassword`) |
| GET    | `/dashboard`                 | Balance + active activations + totals |
| POST   | `/rent-number`               | Rent a number (body: `service`, `country`) |
| GET    | `/activations`               | Activation history (page/limit query) |
| GET    | `/activations/:id`           | Get one activation + SMS code         |
| POST   | `/activations/:id/cancel`    | Cancel an activation                  |
| GET    | `/balance`                   | Wallet balance                        |
| GET    | `/transactions`              | Wallet transactions (page/limit)      |

### Health Check

| Method | Endpoint   | Description        |
| ------ | ---------- | ------------------ |
| GET    | `/health`  | Server health check |

### V1 Endpoints

Base URL: `/api/v1` — **requires Bearer token**.

| Method | Endpoint                   | Query Parameters                                            | Description                              |
| ------ | -------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| GET    | `/getNumber`               | `service`, `country`, `multiple?`, `maxPrice?`, `providerIds?`, `exceptProviderIds?`, `ref?`, `activationType?`, `fixedPrice?` | Purchase a phone number                  |
| GET    | `/setStatus`               | `id`, `status`                                              | Set activation status (get_sms, refuse)  |
| GET    | `/getStatus`               | `id`                                                        | Get SMS code for an activation           |
| GET    | `/getPrices`               | —                                                           | Get pricing for all services             |
| GET    | `/getBalance`              | —                                                           | Get account balance                      |
| GET    | `/getServiceNumbersCount`  | `service`                                                   | Get available number count for a service |
| GET    | `/getProviders`            | `service`, `country`                                        | Get providers for a service/country pair |
| GET    | `/getServicesList`         | —                                                           | List all available services              |
| GET    | `/getCountries`            | —                                                           | List all available countries             |
| GET    | `/getActiveActivations`    | —                                                           | List all active activations              |

### V2 Endpoints

Base URL: `/api/v2` — **requires Bearer token**.

| Method | Endpoint          | Query Parameters                     | Description                      |
| ------ | ----------------- | ------------------------------------ | -------------------------------- |
| GET    | `/getFreePrices`  | `service`, `country`                 | Get free pricing info            |
| GET    | `/getPricesV2`    | `service`, `country`                 | Get prices (V2 format)           |
| GET    | `/getNumberV2`    | `service`, `country`, `multiple?`, `maxPrice?`, `providerIds?`, `exceptProviderIds?`, `ref?`, `activationType?` | Purchase a number (V2)           |
| GET    | `/getStatusV2`    | `id`                                 | Get SMS code (V2 format)         |
| GET    | `/setStatusV2`    | `id`, `status`                       | Set activation status (V2)       |

### V3 Endpoints

Base URL: `/api/v3` — **requires Bearer token**.

| Method | Endpoint         | Query Parameters    | Description                             |
| ------ | ---------------- | ------------------- | --------------------------------------- |
| GET    | `/getPricesV3`   | `service`, `country`| Get prices with provider breakdown (V3) |
| GET    | `/getOffers`     | `services?`, `countries?` | Combined price + stock showcase    |

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "title": "ErrorName",
    "message": "Human-readable error message",
    "details": []
  }
}
```

| Error Code         | HTTP Status | Description                            |
| ------------------ | ----------- | -------------------------------------- |
| `BAD_KEY`          | 401         | Invalid API key                        |
| `BAD_ACTION`       | 200         | Invalid action parameter               |
| `BAD_SERVICE`      | 200         | Unknown service code                   |
| `BAD_COUNTRY`      | 200         | Unknown country code                   |
| `BAD_NUMBER`       | 200         | Invalid phone number                   |
| `BAD_STATUS`       | 200         | Invalid status value                   |
| `FULL_NUMBER`      | 200         | No numbers available for service       |
| `NO_NUMBERS`       | 200         | No numbers available                   |
| Rate Limit         | 429         | Too many requests                      |

## Adding New Endpoints

1. **Service** - Add API call logic in `src/services/hero-sms.service.js`
2. **Controller** - Add handler in `src/controllers/vX.controller.js`
3. **Route** - Register the route in `src/routes/vX.routes.js`
4. **Validation** (optional) - Create Joi schema in `src/validators/` and use `validate()` middleware

## License

ISC
