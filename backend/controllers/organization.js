import mongoose from "mongoose";
import Organization from "../models/organization.js";
import Department from "../models/department.js"
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import department from "../models/department.js";


export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ deleteStatus: false });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};


export const getOrganizationDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const organizations = await Organization.findOne({ deleteStatus: false,_id:id });
    const departments = await Department.find({organization_id:id,parent_department_id:null });


    res.status(200).json({error:false,organization:organizations,departments:departments});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};



export const getRecycleOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ deleteStatus: true });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const createOrganization = async (req, res) => {
  const organization = req.body;
   
  try {
    const existingOrganization = await Organization.findOne({
      name: organization?.name,
    });
    if (existingOrganization) {
      if (!existingOrganization?.deleteStatus) {
        return res.status(201).send({ message: "Name already exist" });
      } else {
        
        const updateOrganization = await Organization.findByIdAndUpdate(
          existingOrganization?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
      }
    }

    
    
    const newOrganization = new Organization({ name:organization.name});
    
    await newOrganization.save();

    res.status(200).json({error:false, message: "Organization Added" });

  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  const id = req.params.id;
  const organization = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No organization with that id");
  try {
    const existingOrganization = await Organization.findOne({
      name: organization?.name,
      _id: { $ne: id },
    });
    if (existingOrganization) {
      if (!existingOrganization?.deleteStatus) {
        return res.status(201).send({ message: "Name already exist" });
      } else {
        await Organization.findByIdAndRemove(existingOrganization?._id);
      }
    }
    const updateOrganization = await Organization.findByIdAndUpdate(id, organization, {
      new: true,
    });
    res.status(200).json({
      error:false,
      message:"Organization Updated Successfully",
    });
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No organization with that id");
  const deleteOrganization = await Organization.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteOrganization);
};

export const deleteOrganizations = async (req, res) => {
  try {
    await Organization.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const organizations = await Organization.find({ deleteStatus: false });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const restoreOrganization = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No organization with that id");
  await Organization.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Organization restored successfully" });
};

export const restoreOrganizations = async (req, res) => {
  try {
    await Organization.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const organizations = await Organization.find({ deleteStatus: true });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteOrganization = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No organization with that id");

  const departmenCount = await department.countDocuments({organization_id:id});
  if(departmenCount>0){
    res.status(404).json({ message: "Cannot Delete Organization because it used by department" });
  }else{
    await Organization.findByIdAndRemove(id);
    res.status(200).json({ message: "Organization deleted successfully" });
  }

};

export const permanentDeleteOrganizations = async (req, res) => {
  try {
    await Organization.deleteMany({
      deleteStatus: true,
    });
    const organizations = await Organization.find({ deleteStatus: true });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
