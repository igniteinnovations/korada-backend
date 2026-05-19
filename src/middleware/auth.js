import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,

        message: "Unauthorized",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin data to request
    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,

      message: "Invalid or expired token",
    });
  }
};

export default auth;
