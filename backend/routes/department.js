import express from "express";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  permanentDeleteDepartment,
  deleteDepartment,
  deleteDepartments,
  restoreDepartment,
  restoreDepartments,
  permanentDeleteDepartments,
  getRecycleDepartments,
  getDepartmentDetail
} from "../controllers/department.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/:id", getDepartmentDetail);

router.get("/recycle", getRecycleDepartments);
router.post("/", createDepartment);




router.patch("/:id", updateDepartment);
router.delete("/:id", permanentDeleteDepartment);
router.get("/permanentDeleteAll", permanentDeleteDepartments);
router.delete("/delete/:id", deleteDepartment);
router.get("/deleteAll", deleteDepartments);
router.delete("/restore/:id", restoreDepartment);
router.get("/restoreAll", restoreDepartments);

export default router;
