import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
config();

// Define log directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logDirectory;
// If in production, the application will be in docker so use an absolute path
if (process.env.NODE_ENV === "development") {
  logDirectory = `${__dirname}/../../Logs`;
} else {
  logDirectory = "/tmp/logs";
}

// Create a daily rotate file transport
const dailyRotateFileTransport = new DailyRotateFile({
  dirname: logDirectory,
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

// Create Winston logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      // Include additional metadata in the log
      const metaString = Object.keys(meta).length
        ? ` | ${JSON.stringify(meta)}`
        : "";
      return `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}`;
    })
  ),
  transports: [dailyRotateFileTransport],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

export default logger;
