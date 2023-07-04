import express from "express";
import {
  signin,
  forgotPassword,
  getToken,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.get("/reset-token/:id", getToken);
router.patch("/reset-password/:token", resetPassword);

export default router;
