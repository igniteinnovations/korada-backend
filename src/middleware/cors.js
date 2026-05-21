import cors from "cors";

const corsMiddleware = cors({
  origin: ["https://gundusoodhinews.web.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

export default corsMiddleware;
