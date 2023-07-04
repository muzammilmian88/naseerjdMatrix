import express from "express";
import {
  getTiers,
  createTier,
  updateTier,
  deleteTier,
  permanentDeleteTier,
  permanentDeleteTiers,
  deleteTiers,
  restoreTier,
  restoreTiers,
  getRecycleTiers,
  getTiersByDesignation,
} from "../controllers/tier.js";

const router = express.Router();

router.get("/", getTiers);
router.get("/recycle", getRecycleTiers);
router.get("/:designation", getTiersByDesignation);
router.post("/", createTier);
router.patch("/:id", updateTier);
router.delete("/:id", permanentDeleteTier);
router.get("/permanentDeleteAll", permanentDeleteTiers);
router.delete("/delete/:id", deleteTier);
router.get("/deleteAll", deleteTiers);
router.delete("/restore/:id", restoreTier);
router.get("/restoreAll", restoreTiers);
export default router;
