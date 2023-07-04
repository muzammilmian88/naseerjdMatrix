import express from "express";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  permanentDeleteOrganization,
  permanentDeleteOrganizations,
  deleteOrganizations,
  restoreOrganization,
  restoreOrganizations,
  getRecycleOrganizations,
  getOrganizationDetail
} from "../controllers/organization.js";

const router = express.Router();

router.get("/", getOrganizations);
router.get("/:id", getOrganizationDetail);
router.get("/recycle", getRecycleOrganizations);
router.post("/", createOrganization);
router.patch("/:id", updateOrganization);
router.delete("/:id", permanentDeleteOrganization);
router.get("/permanentDeleteAll", permanentDeleteOrganizations);
router.delete("/delete/:id", deleteOrganization);
router.get("/deleteAll", deleteOrganizations);
router.delete("/restore/:id", restoreOrganization);
router.get("/restoreAll", restoreOrganizations);
export default router;
