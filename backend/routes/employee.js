import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  permanentDeleteEmployee,
  permanentDeleteEmployees,
  deleteEmployees,
  restoreEmployee,
  restoreEmployees,
  getRecycleEmployees,
  getEmployeeDetail
} from "../controllers/employee.js";

import multer from 'multer';

const uploadfile=multer({
  storage:multer.diskStorage({
    destination:function(req,file,callback){  
      callback(null,'./uploads/profile_images');
    },
    filename:function(req,file,callback){
      callback(null,Date.now()+"-"+file.originalname)
    }
  })
}).single('profile_image');

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getEmployeeDetail);
router.get("/recycle", getRecycleEmployees);
router.post("/",uploadfile, createEmployee);
router.patch("/:id",uploadfile, updateEmployee);
router.delete("/:id", permanentDeleteEmployee);
router.get("/permanentDeleteAll", permanentDeleteEmployees);
router.delete("/delete/:id", deleteEmployee);
router.get("/deleteAll", deleteEmployees);
router.delete("/restore/:id", restoreEmployee);
router.get("/restoreAll", restoreEmployees);
export default router;
