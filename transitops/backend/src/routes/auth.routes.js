import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    errors: []
  }
});

authRouter.post("/login", loginLimiter, login);
authRouter.get("/me", authenticate, me);
authRouter.post("/logout", logout);
