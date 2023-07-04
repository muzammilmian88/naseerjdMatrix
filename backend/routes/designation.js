import express from "express";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  permanentDeleteDesignation,
  permanentDeleteDesignations,
  deleteDesignations,
  restoreDesignation,
  restoreDesignations,
  getRecycleDesignations,
} from "../controllers/designation.js";

const router = express.Router();

router.get("/", getDesignations);
router.get("/recycle", getRecycleDesignations);
router.post("/", createDesignation);
router.patch("/:id", updateDesignation);
router.delete("/:id", permanentDeleteDesignation);
router.get("/permanentDeleteAll", permanentDeleteDesignations);
router.delete("/delete/:id", deleteDesignation);
router.get("/deleteAll", deleteDesignations);
router.delete("/restore/:id", restoreDesignation);
router.get("/restoreAll", restoreDesignations);
export default router;
