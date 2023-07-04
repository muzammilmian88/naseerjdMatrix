import express from "express";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  permanentDeleteTemplate,
  deleteTemplate,
  deleteTemplates,
  restoreTemplate,
  restoreTemplates,
  permanentDeleteTemplates,
  getRecycleTemplates,
  getTemplateDetail
} from "../controllers/template.js";

const router = express.Router();

router.get("/", getTemplates);
router.get("/:id", getTemplateDetail);
router.get("/recycle", getRecycleTemplates);
router.post("/", createTemplate);
router.patch("/:id", updateTemplate);
router.delete("/:id", permanentDeleteTemplate);
router.get("/permanentDeleteAll", permanentDeleteTemplates);
router.delete("/delete/:id", deleteTemplate);
router.get("/deleteAll", deleteTemplates);
router.delete("/restore/:id", restoreTemplate);
router.get("/restoreAll", restoreTemplates);

export default router;
