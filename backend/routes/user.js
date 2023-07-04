import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  permanentDeleteUser,
  permanentDeleteUsers,
  deleteUsers,
  restoreUser,
  restoreUsers,
  getRecycleUsers,
} from "../controllers/user.js";
import { email } from "../middleware/email.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/recycle", getRecycleUsers);
router.post("/", email, createUser);
router.patch("/:id", updateUser);
router.delete("/:id", permanentDeleteUser);
router.get("/permanentDeleteAll", permanentDeleteUsers);
router.delete("/delete/:id", deleteUser);
router.get("/deleteAll", deleteUsers);
router.delete("/restore/:id", restoreUser);
router.get("/restoreAll", restoreUsers);

export default router;
