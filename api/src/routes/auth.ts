import { Router } from "express";
import { AuthController } from "../controllers/auth";

const auth = Router();
const authController = new AuthController();

auth.get("/", (_req, res) => res.json({ ok: true, message: "Auth API is running" }));
auth.post("/register", (req, res) => authController.register(req, res));
auth.post("/login", (req, res) => authController.login(req, res));
auth.post("/verify", (req, res) => authController.verify(req, res));
auth.post("/resend-otp", (req, res) => authController.resendOTP(req, res));
auth.put("/update", (req, res) => authController.accountUpdate(req, res));
auth.delete("/delete", (req, res) => authController.accountDeletion(req, res));

export default auth;