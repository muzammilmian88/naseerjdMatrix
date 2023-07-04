import mongoose from "mongoose";
import LevelOfEmployee from "../models/level_of_employee.js";

export const getLevelOfEmployees = async (req, res) => {
  try {
    const levelOfEmployees = await LevelOfEmployee.find({ deleteStatus: false }).populate(['level_grade','designation','staff']);
    
    res.status(200).json(levelOfEmployees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecycleLevelOfEmployees = async (req, res) => {
  try {
    const levelOfEmployees = await LevelOfEmployee.find({ deleteStatus: true });
    res.status(200).json(levelOfEmployees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createLevelOfEmployee = async (req, res) => {
  const levelOfEmployee = req.body;
  
  try {
    const existingLevelOfEmployee = await LevelOfEmployee.findOne({
      level: levelOfEmployee?.level,
    });
    if (existingLevelOfEmployee) {
      if (!existingLevelOfEmployee?.deleteStatus) {
        return res.status(201).send({error:true, message: "level already exist" });
      } else {
        const updateLevelOfEmployee = await LevelOfEmployee.findByIdAndUpdate(
          existingLevelOfEmployee?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
        return res.status(200).json({error:false, message:"LevelOfEmployee Updated Successfully"});
      }
    }
    const newLevelOfEmployee = new LevelOfEmployee({ ...levelOfEmployee });
    await newLevelOfEmployee.save();
    res.status(200).json({error:false, message:"Level Of Employee Added Successfully"});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateLevelOfEmployee = async (req, res) => {
  const id = req.params.id;
  const levelOfEmployee = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({error:true,message:"No level Of Employee with that id"});
  try {
    const existingLevelOfEmployee = await LevelOfEmployee.findOne({
      level: levelOfEmployee?.level,
      _id: { $ne: id },
    });
    if (existingLevelOfEmployee) {
      if (!existingLevelOfEmployee?.deleteStatus) {
        return res.status(201).send({error:true, message: "Level already exist" });
      } else {
        await LevelOfEmployee.findByIdAndRemove(existingLevelOfEmployee?._id);
      }
    }
    const updateLevelOfEmployee = await LevelOfEmployee.findByIdAndUpdate(id, levelOfEmployee, {
      new: true,
    });
    res.status(200).json({error:false, message:"Level Of Employee Updated Successfully"});
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteLevelOfEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No level Of Employee with that id");
  const deleteLevelOfEmployee = await LevelOfEmployee.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteLevelOfEmployee);
};

export const deleteLevelOfEmployees = async (req, res) => {
  try {
    await LevelOfEmployee.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const levelOfEmployees = await LevelOfEmployee.find({ deleteStatus: false });
    res.status(200).json(levelOfEmployees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreLevelOfEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No level Of Employee with that id");
  await LevelOfEmployee.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Level Of Employee restored successfully" });
};

export const restoreLevelOfEmployees = async (req, res) => {
  try {
    await LevelOfEmployee.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const levelOfEmployees = await LevelOfEmployee.find({ deleteStatus: true });
    res.status(200).json(levelOfEmployees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteLevelOfEmployee = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No level Of Employee with that id");
  await LevelOfEmployee.findByIdAndRemove(id);
  res.status(200).json({ message: "Level Of Employee deleted successfully" });
};

export const permanentDeleteLevelOfEmployees = async (req, res) => {
  try {
    await LevelOfEmployee.deleteMany({
      deleteStatus: true,
    });
    const levelOfEmployees = await LevelOfEmployee.find({ deleteStatus: true });
    res.status(200).json(levelOfEmployees);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
