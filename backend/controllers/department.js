import mongoose from "mongoose";
import Department from "../models/department.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const getDepartments = async (req, res) => {
  try {
    
    let departments = await Department.aggregate([
      {
        $lookup: {
          from: "organizations",
          localField: "organization_id",
          foreignField: "_id",
          as: "organization_detail",
        }
      },
      {
         $match : { parent_department_id : null }
      }
    ]);

    departments=departments.filter((dep)=>{
      return dep.deleteStatus==false;
    })
    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const getDepartmentDetail= async (req, res)=>{
  const dep_id=req.params.id;
  try{
    let department = await Department.findOne({_id:dep_id}).populate('organization_id')
    const subdepartment= await Department.find({parent_department_id:dep_id});

    const departmentdetail={
      error:false,
      department:department,
      sub_department:subdepartment
    }



    res.status(200).json(departmentdetail);


  }catch(error){
    res.status(404).json({
      error:true,
      message:error.message
    })
  }

}

export const getRecycleDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ deleteStatus: true });
    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const created = async (req, res) => {
  const department=req.body.name;
  res.json(department)
}

export const createDepartment = async (req, res) => {
  const department = req.body.department;
  const sub_departments = req.body.sub_departments;
  try {
    
    const newDepartment = new Department({name:department.name,organization_id:department.organization_id,short_name:department.short_name,parent_department_id:department.parent_department_id});
    let add_dept=await newDepartment.save();

    if(sub_departments.length!=0){
      sub_departments.map(async (dep)=>{
        const sub_department={
          name: dep.name,
          parent_department_id:newDepartment._id,
          organization_id:newDepartment.organization_id
        }
        const subDepartment = new Department({ ...sub_department });
        var add_Sub_dept=await subDepartment.save();
      })
      
    }
    
    res.status(200).json({
      error:false,
      message:"Department Added Successfully",
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  const id = req.params.id;
  const department = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(201).send({ message: "No department with that id" });
  try {
    const existingDepartment = await Department.findOne({
      name: department?.name,
      _id: { $ne: id },
    });
    if (existingDepartment) {
        await Department.findByIdAndRemove(existingDepartment?._id);
    }
    const updateDepartment = await Department.findByIdAndUpdate(
      id,
      department,
      {
        new: true,
      }
    );
    res.status(200).json({
      error:false,
      message:"Department Updated Successfully"
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No department with that id");
  await Department.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Department deleted successfully" });
};

export const deleteDepartments = async (req, res) => {
  try {
    await Department.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const departments = await Department.find({ deleteStatus: false });
    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreDepartment = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No department with that id");
  await Department.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Department restored successfully" });
};

export const restoreDepartments = async (req, res) => {
  try {
    await Department.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const departments = await Department.find({ deleteStatus: true });
    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteDepartment = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No department with that id");


  const subdepartmenCount = await Department.countDocuments({parent_department_id:id});
  if(subdepartmenCount>0){
    res.status(404).json({ message: "Cannot Delete Department because it used by Sub-department" });
  }else{
    await Department.findByIdAndRemove(id);
    res.status(200).json({ error: false, message: "Department deleted successfully" });
  }
};

export const permanentDeleteDepartments = async (req, res) => {
  try {
    await Department.deleteMany({
      deleteStatus: true,
    });



    const departments = await Department.find({ deleteStatus: true });
    res.status(200).json(departments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



function randomString(length) {
  var chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}



function Send_Email(to,subject,message) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "muzammilfyp@gmail.com",
      pass: "qkksbpbwrqdminve",
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(
    {
      from: "'No Reply' <muzammilfyp@gmail.com>",
      to: to,
      subject: subject,
      html: message,
    },
    (error, info) => {
      if (error) {
        return {status:404,message:"Email is not valid!"}
      } else {
        return {status:200,message:"Organization Created And Email is sent"}
      }
    });
}
