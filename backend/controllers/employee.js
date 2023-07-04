import mongoose from "mongoose";
import Employee from "../models/employee.js";
import StaffType from "../models/staffType.js";
import Tier from "../models/tier.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ deleteStatus: false }).populate('designation');
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};


export const getEmployeeDetail = async (req, res) => {
  const id = req.params.id;
  try {
    let employee = await Employee.findOne({ deleteStatus: false, _id: id }).populate(['designation', 'role']);
    const staff_id = employee.designation.staff_type;
    const tier_id = employee.designation.level_grade;
    const staff = await StaffType.findOne({ deleteStatus: false, _id: staff_id });
    const tier = await Tier.findOne({ deleteStatus: false, _id: tier_id });


    res.status(200).json({ error: false, employee: employee, staff: staff, tier: tier });
  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};

export const getRecycleEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ deleteStatus: true });
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};

export const createEmployee = async (req, res) => {

  let employee = req.body;

  try {
    const existingEmployee = await Employee.findOne({
      email: employee?.email,
    });
    if (existingEmployee) {
      if (!existingEmployee?.deleteStatus) {
        return res.status(201).send({ message: "Email already exist" });
      } else {

        const updateEmployee = await Employee.findByIdAndUpdate(
          existingEmployee?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
      }
    }
    if(req.file){
      if (req.file || Object.keys(req.file).length !== 0){
        const file = req.file;
        // checking file type must be image
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          removeTmp(file.path)
          return res.json({ error: true, msg: "File format is incorrect." })
        }
        // uploading image to cloudnary
        await cloudinary.v2.uploader.upload(file.path, { folder: "jd_images" }, async (err, result) => {
          if(err) throw err;
          removeTmp(file.path)
          employee.profile_image= { public_id: result.public_id, url: result.secure_url }
        })
      }
    }
    const newEmployee = new Employee({...employee});
    await newEmployee.save();

    res.status(200).json({error:false, message: "Employee Added", file:req.file});

  } catch (error) {
    res.status(404).json({error:true, message: error.message, t:'aaa' });
  }
};

export const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const employee = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No employee with that id");
  try {
    const existingEmployee = await Employee.findOne({
      email: employee?.email,
      _id: { $ne: id },
    });
   
    if (existingEmployee) {
      if (!existingEmployee?.deleteStatus) {
        return res.status(201).send({ message: "Email already exist" });
      } else {
        
        await Employee.findByIdAndRemove(existingEmployee?._id);
      }
    }
    const existingEmployee2 = await Employee.findOne({
      _id: id ,
    });
    employee.profile_image=existingEmployee2.profile_image;
    if(req.file){
      
      if (req.file || Object.keys(req.file).length !== 0){
        const file = req.file;
        // checking file type must be image
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          removeTmp(file.path)
          return res.json({ error: true, msg: "File format is incorrect." })
        }
        // uploading image to cloudnary
        await cloudinary.v2.uploader.upload(file.path, { folder: "jd_images" }, async (err, result) => {
          if(err) throw err;
          removeTmp(file.path)
          employee.profile_image= { public_id: result.public_id, url: result.secure_url }
        })
      }
    }
    
    const updateEmployee = await Employee.findByIdAndUpdate(id, employee, {
      new: true,
    });
    res.status(200).json({
      error: false,
      message: "Employee Updated Successfully",
      employee
    });

  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No employee with that id");
  const deleteEmployee = await Employee.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteEmployee);
};

export const deleteEmployees = async (req, res) => {
  try {
    await Employee.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const employees = await Employee.find({ deleteStatus: false });
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ error: true, message: error.message });
  }
};

export const restoreEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No employee with that id");
  await Employee.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Employee restored successfully" });
};

export const restoreEmployees = async (req, res) => {
  try {
    await Employee.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const employees = await Employee.find({ deleteStatus: true });
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No employee with that id");
  await Employee.findByIdAndRemove(id);
  res.status(200).json({ message: "Employee deleted successfully" });
};

export const permanentDeleteEmployees = async (req, res) => {
  try {
    await Employee.deleteMany({
      deleteStatus: true,
    });
    const employees = await Employee.find({ deleteStatus: true });
    res.status(200).json(employees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

const removeTmp = (path) =>{
  fs.unlink(path, err=>{
      if(err) throw err;
  })
}
