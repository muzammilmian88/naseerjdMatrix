import express from "express";
import {
  getStaffTypes,
  createStaffType,
  updateStaffType,
  deleteStaffType,
  permanentDeleteStaffType,
  permanentDeleteStaffTypes,
  deleteStaffTypes,
  restoreStaffType,
  restoreStaffTypes,
  getRecycleStaffTypes,
} from "../controllers/staffType.js";

const router = express.Router();

router.get("/", getStaffTypes);
router.get("/recycle", getRecycleStaffTypes);
router.post("/", createStaffType);
router.patch("/:id", updateStaffType);
router.delete("/:id", permanentDeleteStaffType);
router.get("/permanentDeleteAll", permanentDeleteStaffTypes);
router.delete("/delete/:id", deleteStaffType);
router.get("/deleteAll", deleteStaffTypes);
router.delete("/restore/:id", restoreStaffType);
router.get("/restoreAll", restoreStaffTypes);
export default router;
