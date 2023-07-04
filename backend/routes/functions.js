import express from "express";
import {
  createFunction,
  createSubFunction,
  updateFunction,
  permanentDeleteFunction,
  deleteFunction,
  deleteFunctions,
  restoreFunction,
  restoreFunctions,
  getRecycleFunctions,
  getFunctionDetail
} from "../controllers/functions.js";

const router = express.Router();


router.get("/:id", getFunctionDetail);

router.get("/recycle", getRecycleFunctions);
router.post("/", createFunction);
router.post("/sub_functions/", createSubFunction);


router.patch("/:id", updateFunction);
router.delete("/:id", permanentDeleteFunction);
router.delete("/delete/:id", deleteFunction);
router.get("/deleteAll", deleteFunctions);
router.delete("/restore/:id", restoreFunction);
router.get("/restoreAll", restoreFunctions);

export default router;
