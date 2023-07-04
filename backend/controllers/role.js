import mongoose from "mongoose";
import Role from "../models/role.js";
import Employee from "../models/employee.js"; 

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ deleteStatus: false });
    res.status(200).json(roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecycleRoles = async (req, res) => {
  try {
    const roles = await Role.find({ deleteStatus: true });
    res.status(200).json(roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  const role = req.body;
  
  try {
    const existingRole = await Role.findOne({
      name: role?.name,
    });
    if (existingRole) {
      if (!existingRole?.deleteStatus) {
        return res.status(201).send({error:true, message: "Name already exist" });
      } else {
        const updateRole = await Role.findByIdAndUpdate(
          existingRole?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
        return res.status(200).json({error:false, message:"Role Updated Successfully"});
      }
    }
    const newRole = new Role({ ...role });
    await newRole.save();
    res.status(200).json({error:false, message:"Role Added Successfully"});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateRole = async (req, res) => {
  const id = req.params.id;
  const role = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({error:true,message:"No role with that id"});
  try {
    const existingRole = await Role.findOne({
      name: role?.name,
      _id: { $ne: id },
    });
    if (existingRole) {
      if (!existingRole?.deleteStatus) {
        return res.status(201).send({error:true, message: "Name already exist" });
      } else {
        await Role.findByIdAndRemove(existingRole?._id);
      }
    }
    const updateRole = await Role.findByIdAndUpdate(id, role, {
      new: true,
    });
    res.status(200).json({error:false, message:"Role Updated Successfully"});
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No role with that id");
  const deleteRole = await Role.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteRole);
};

export const deleteRoles = async (req, res) => {
  try {
    await Role.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const roles = await Role.find({ deleteStatus: false });
    res.status(200).json(roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreRole = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No role with that id");
  await Role.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Role restored successfully" });
};

export const restoreRoles = async (req, res) => {
  try {
    await Role.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const roles = await Role.find({ deleteStatus: true });
    res.status(200).json(roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteRole = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No role with that id");

  const rolecount = await Employee.countDocuments({role:id});
  if(rolecount){
    res.status(404).json({message:"Cannot delete role because it is used by employee"});
  }else{
    await Role.findByIdAndRemove(id);
    res.status(200).json({ error:false, message: "Role deleted successfully" });
  }
};

export const permanentDeleteRoles = async (req, res) => {
  try {
    await Role.deleteMany({
      deleteStatus: true,
    });
    const roles = await Role.find({ deleteStatus: true });
    res.status(200).json(roles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
