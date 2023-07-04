import mongoose from "mongoose";
import Designation from "../models/designation.js";
import Employee from "../models/employee.js";

export const getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find({ deleteStatus: false }).populate(['staff_type','level_grade']);
    res.status(200).json(designations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecycleDesignations = async (req, res) => {
  try {
    const designations = await Designation.find({ deleteStatus: true });
    res.status(200).json(designations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDesignation = async (req, res) => {
  const designation = req.body;
  
  try {
    const existingDesignation = await Designation.findOne({
      name: designation?.name,
      staff_type: designation?.staff_type,
      level_grade: designation?.level_grade,
    });
    if (existingDesignation) {
      if (!existingDesignation?.deleteStatus) {
        return res.status(201).send({error:true, message: "Desination Name with this staff Type and tier already exist" });
      } else {
        const updateDesignation = await Designation.findByIdAndUpdate(
          existingDesignation?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
        return res.status(200).json({error:false, message:"Designation Updated Successfully"});
      }
    }
    const newDesignation = new Designation({ ...designation });
    await newDesignation.save();
    res.status(200).json({error:false, message:"Designation Added Successfully"});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateDesignation = async (req, res) => {
  const id = req.params.id;
  const designation = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({error:true,message:"No designation with that id"});
  try {
    const existingDesignation = await Designation.findOne({
      name: designation?.name,
      staff_type: designation?.staff_type,
      level_grade: designation?.level_grade,
      _id: { $ne: id },
    });
    if (existingDesignation) {
      if (!existingDesignation?.deleteStatus) {
        return res.status(201).send({error:true, message: "Desination Name with this staff Type and tier already exist" });
      } else {
        await Designation.findByIdAndRemove(existingDesignation?._id);
      }
    }
    const updateDesignation = await Designation.findByIdAndUpdate(id, designation, {
      new: true,
    });
    res.status(200).json({error:false, message:"Designation Updated Successfully"});
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteDesignation = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No designation with that id");
  const deleteDesignation = await Designation.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteDesignation);
};

export const deleteDesignations = async (req, res) => {
  try {
    await Designation.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const designations = await Designation.find({ deleteStatus: false });
    res.status(200).json(designations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreDesignation = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No designation with that id");
  await Designation.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Designation restored successfully" });
};

export const restoreDesignations = async (req, res) => {
  try {
    await Designation.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const designations = await Designation.find({ deleteStatus: true });
    res.status(200).json(designations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteDesignation = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No designation with that id");

    const employeecount = await Employee.countDocuments({designation:id});
  if(employeecount){
    res.status(404).json({message:"Cannot delete designation because it is used in employee"});
  }else{
    await Designation.findByIdAndRemove(id);
  res.status(200).json({error:false, message: "Designation deleted successfully" });
  }
  
};

export const permanentDeleteDesignations = async (req, res) => {
  try {
    await Designation.deleteMany({
      deleteStatus: true,
    });
    const designations = await Designation.find({ deleteStatus: true });
    res.status(200).json(designations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
