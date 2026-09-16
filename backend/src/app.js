import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(helmet());
const corsOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: { success: false, error: { message: "Too many requests" } },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: "Not Found" } });
});

app.use(errorHandler);

export default app;
