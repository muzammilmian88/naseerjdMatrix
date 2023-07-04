import mongoose from "mongoose";
import StaffType from "../models/staffType.js";
import Designation from '../models/designation.js'

export const getStaffTypes = async (req, res) => {
  try {
    const staffTypes = await StaffType.find({ deleteStatus: false });
    res.status(200).json(staffTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecycleStaffTypes = async (req, res) => {
  try {
    const staffTypes = await StaffType.find({ deleteStatus: true });
    res.status(200).json(staffTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createStaffType = async (req, res) => {
  const staffType = req.body;
  
  try {
    const existingStaffType = await StaffType.findOne({
      name: staffType?.name,
    });
    if (existingStaffType) {
      if (!existingStaffType?.deleteStatus) {
        return res.status(201).send({error:true, message: "Name already exist" });
      } else {
        const updateStaffType = await StaffType.findByIdAndUpdate(
          existingStaffType?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
        return res.status(200).json({error:false, message:"StaffType Updated Successfully"});
      }
    }
    const newStaffType = new StaffType({ ...staffType });
    await newStaffType.save();
    res.status(200).json({error:false, message:"StaffType Added Successfully"});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateStaffType = async (req, res) => {
  const id = req.params.id;
  const staffType = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({error:true,message:"No staffType with that id"});
  try {
    const existingStaffType = await StaffType.findOne({
      name: staffType?.name,
      _id: { $ne: id },
    });
    if (existingStaffType) {
      if (!existingStaffType?.deleteStatus) {
        return res.status(201).send({error:true, message: "Name already exist" });
      } else {
        await StaffType.findByIdAndRemove(existingStaffType?._id);
      }
    }
    const updateStaffType = await StaffType.findByIdAndUpdate(id, staffType, {
      new: true,
    });
    res.status(200).json({error:false, message:"StaffType Updated Successfully"});
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteStaffType = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No staffType with that id");
  const deleteStaffType = await StaffType.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteStaffType);
};

export const deleteStaffTypes = async (req, res) => {
  try {
    await StaffType.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const staffTypes = await StaffType.find({ deleteStatus: false });
    res.status(200).json(staffTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreStaffType = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No staffType with that id");
  await StaffType.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "StaffType restored successfully" });
};

export const restoreStaffTypes = async (req, res) => {
  try {
    await StaffType.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const staffTypes = await StaffType.find({ deleteStatus: true });
    res.status(200).json(staffTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteStaffType = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No staffType with that id");
    const staffcount = await Designation.countDocuments({staff_type:id});
  if(staffcount){
    res.status(404).json({message:"Cannot delete staff because it is used in Designation"});
  }else{
    await StaffType.findByIdAndRemove(id);
    res.status(200).json({error:false, message: "StaffType deleted successfully" });
  }
};

export const permanentDeleteStaffTypes = async (req, res) => {
  try {
    await StaffType.deleteMany({
      deleteStatus: true,
    });
    const staffTypes = await StaffType.find({ deleteStatus: true });
    res.status(200).json(staffTypes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
