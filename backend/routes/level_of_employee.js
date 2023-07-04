import express from "express";
import {
  getLevelOfEmployees,
  createLevelOfEmployee,
  updateLevelOfEmployee,
  deleteLevelOfEmployee,
  permanentDeleteLevelOfEmployee,
  permanentDeleteLevelOfEmployees,
  deleteLevelOfEmployees,
  restoreLevelOfEmployee,
  restoreLevelOfEmployees,
  getRecycleLevelOfEmployees,
} from "../controllers/level_of_employee.js";

const router = express.Router();

router.get("/", getLevelOfEmployees);
router.get("/recycle", getRecycleLevelOfEmployees);
router.post("/", createLevelOfEmployee);
router.patch("/:id", updateLevelOfEmployee);
router.delete("/:id", permanentDeleteLevelOfEmployee);
router.get("/permanentDeleteAll", permanentDeleteLevelOfEmployees);
router.delete("/delete/:id", deleteLevelOfEmployee);
router.get("/deleteAll", deleteLevelOfEmployees);
router.delete("/restore/:id", restoreLevelOfEmployee);
router.get("/restoreAll", restoreLevelOfEmployees);
export default router;
