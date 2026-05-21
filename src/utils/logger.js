import winston from "winston";

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),

    winston.format.errors({
      stack: true,
    }),

    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),

  transports: [
    // Console Logs
    new winston.transports.Console(),

    // Error Logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // Combined Logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
