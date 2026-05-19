import cors from "cors";

const corsMiddleware = cors({
  origin: "*",
  credentials: true,
});

export default corsMiddleware;
