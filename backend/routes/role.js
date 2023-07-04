import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  permanentDeleteRole,
  permanentDeleteRoles,
  deleteRoles,
  restoreRole,
  restoreRoles,
  getRecycleRoles,
} from "../controllers/role.js";

const router = express.Router();

router.get("/", getRoles);
router.get("/recycle", getRecycleRoles);
router.post("/", createRole);
router.patch("/:id", updateRole);
router.delete("/:id", permanentDeleteRole);
router.get("/permanentDeleteAll", permanentDeleteRoles);
router.delete("/delete/:id", deleteRole);
router.get("/deleteAll", deleteRoles);
router.delete("/restore/:id", restoreRole);
router.get("/restoreAll", restoreRoles);
export default router;
