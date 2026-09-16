import app from "./app.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

export default server;
