import mongoose from "mongoose";
import Template from "../models/template.js";
import Functions from "../models/functions.js";
import nodemailer from "nodemailer";

// export const getTemplates = async (req, res) => {
//   try {
    
//     let templates = await Template.aggregate([
//       {
//         $lookup: {
//           from: "organizations",
//           localField: "organization_id",
//           foreignField: "_id",
//           as: "organization_detail",
//         }
//       },
//       {
//          $match : { parent_template_id : null }
//       }
//     ]);

//     templates=templates.filter((dep)=>{
//       return dep.deleteStatus==false;
//     })
//     res.status(200).json(templates);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const getTemplates = async (req, res) => {
    try {
      
      let templates = await Template.find();

      res.status(200).json(templates);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

export const getTemplateDetail= async (req, res)=>{
  const temp_id=req.params.id;
  try{
    let template = await Template.findOne({_id:temp_id});
    let functions= await Functions.find({parent_template_id:temp_id});
    
    const templatedetail={
      error:false,
      template:template,
      functions:functions
    }
    res.status(200).json(templatedetail);
  }catch(error){
    res.status(404).json({
      error:true,
      message:error.message
    })
  }

}

export const getRecycleTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ deleteStatus: true });
    res.status(200).json(templates);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const created = async (req, res) => {
  const template=req.body.name;
  res.json(template)
}

export const createTemplate = async (req, res) => {
   
  const template = req.body.template;

  const functions = req.body.functions;
  try {
      const existingTemplate = await Template.findOne({
        name: template?.name,
      });
      
      if(existingTemplate){
        if (!existingTemplate?.deleteStatus) {
          return res.status(201).send({ message: "Name already exist" });
        } 
      }
      
      const newTemplate = new Template(template);
      let add_template=await newTemplate.save();

      if(functions.length!=0){
        functions.map(async (dep)=>{
            const single_functions={
            name: dep.name,
            parent_template_id:newTemplate._id,
            }
            const singleFunction = new Functions({ ...single_functions });
            var add_Sub_dept=await singleFunction.save();
        })
      }
    res.status(200).json({
      error:false,
      message:"Template Added Successfully",
      });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const updateTemplate = async (req, res) => {
  const id = req.params.id;
  const template = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(201).send({ message: "No template with that id" });
  try {
    const existingTemplate = await Template.findOne({
      name: template?.name,
      _id: { $ne: id },
    });
    if (existingTemplate) {
        await Template.findByIdAndRemove(existingTemplate?._id);
    }
    const updateTemplate = await Template.findByIdAndUpdate(
      id,
      template,
      {
        new: true,
      }
    );
    res.status(200).json({
      error:false,
      message:"Template Updated Successfully"
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No template with that id");
  await Template.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Template deleted successfully" });
};

export const deleteTemplates = async (req, res) => {
  try {
    await Template.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const templates = await Template.find({ deleteStatus: false });
    res.status(200).json(templates);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreTemplate = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No template with that id");
  await Template.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Template restored successfully" });
};

export const restoreTemplates = async (req, res) => {
  try {
    await Template.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const templates = await Template.find({ deleteStatus: true });
    res.status(200).json(templates);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteTemplate = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No template with that id");


  const subdepartmenCount = await Functions.countDocuments({parent_template_id:id});
  console.log(subdepartmenCount)
  if(subdepartmenCount>0){
    res.status(404).json({ message: "Cannot Delete Template because it used by functions" });
  }else{
    await Template.findByIdAndRemove(id);
    res.status(200).json({ error: false, message: "Template deleted successfully" });
  }
};

export const permanentDeleteTemplates = async (req, res) => {
  try {
    await Template.deleteMany({
      deleteStatus: true,
    });

    const templates = await Template.find({ deleteStatus: true });
    res.status(200).json(templates);
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
