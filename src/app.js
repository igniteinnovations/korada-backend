import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import corsMiddleware from "./middleware/cors.js";
import rateLimit from "./utils/rateLimit.js";

// Routes
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import newsRoutes from "./routes/news.routes.js";
import WeekendExperienceRoutes from "./routes/weekendExperience.routes.js";
import advertisementRoutes from "./routes/advertisement.routes.js";
import AnalyticsRoutes from "./routes/analytics.routes.js";
const app = express();
// Body Parser
app.use(express.json());
// Security
app.use(helmet());
// Compression
app.use(compression());
// CORS
app.use(corsMiddleware);
// Rate Limit
app.use(rateLimit);
// Logger
app.use(morgan("dev"));
// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Korada News API Running",
  });
});

//routes
app.use("/api/v1/admin", adminAuthRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/weekend-experiences", WeekendExperienceRoutes);
app.use("/api/v1/advertisements", advertisementRoutes);
app.use("/api/v1/analytics", AnalyticsRoutes);

// Global Error Handler
app.use(errorHandler);
export default app;
