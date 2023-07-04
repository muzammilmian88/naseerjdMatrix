import mongoose from "mongoose";
import Function from "../models/functions.js";
import { response } from "express";


export const getFunctionDetail= async (req, res)=>{
  const function_id=req.params.id;
  try{
    let singleFunction = await Function.findOne({_id:function_id}).populate('parent_template_id')
    const subsingleFunction= await Function.find({parent_function_id:function_id});

    const singleFunctiondetail={
      error:false,
      singleFunction:singleFunction,
      sub_functions:subsingleFunction
    }

    res.status(200).json(singleFunctiondetail);


  }catch(error){
    res.status(404).json({
      error:true,
      message:error.message
    })
  }

}

export const getRecycleFunctions = async (req, res) => {
  try {
    const singleFunctions = await Function.find({ deleteStatus: true });
    res.status(200).json(singleFunctions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const created = async (req, res) => {
  const singleFunction=req.body.name;
  res.json(singleFunction)
}

export const createFunction = async (req, res) => {
  const singleFunction = req.body;
  try {
    
    const newFunction = new Function(singleFunction);
    let add_dept=await newFunction.save();

    res.status(200).json({
      error:false,
      message:"Function Added Successfully",
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};
export const createSubFunction = async (req, res) => {
  const functions = req.body.functions;
  const parent_function_id = req.body.parent_function_id;
  const parent_template_id = req.body.parent_template_id;
  try {

    const modifiedFunctions = functions.map((singleFunction) => {
      singleFunction.parent_function_id = parent_function_id;
      singleFunction.parent_template_id = parent_template_id;
      return singleFunction; // Ret urn the modified function object
    });

    const newFunction = await Function.insertMany(modifiedFunctions);
    

    res.status(200).json({
      error:false,
      message:"Function Added Successfully",
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const updateFunction = async (req, res) => {
  const id = req.params.id;
  const singleFunction = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(201).send({ message: "No Function with that id" });
  try {
    const existingFunction = await Function.findOne({
      name: singleFunction?.name,
      _id: { $ne: id },
    });
    if (existingFunction) {
        await Function.findByIdAndRemove(existingFunction?._id);
    }
    const updateFunction = await Function.findByIdAndUpdate(
      id,
      singleFunction,
      {
        new: true,
      }
    );
    res.status(200).json({
      error:false,
      message:"Function Updated Successfully"
    });
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteFunction = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Function with that id");
  await Function.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Function deleted successfully" });
};

export const deleteFunctions = async (req, res) => {
  try {
    await Function.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const singleFunctions = await Function.find({ deleteStatus: false });
    res.status(200).json(singleFunctions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreFunction = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Function with that id");
  await Function.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Function restored successfully" });
};

export const restoreFunctions = async (req, res) => {
  try {
    await Function.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const singleFunctions = await Function.find({ deleteStatus: true });
    res.status(200).json(singleFunctions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteFunction = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Function with that id");


  const subdepartmenCount = await Function.countDocuments({parent_function_id:id});
  if(subdepartmenCount>0){
    res.status(404).json({ message: "Cannot Delete Function because it used by Sub-Function" });
  }else{
    await Function.findByIdAndRemove(id);
    res.status(200).json({ error: false, message: "Function deleted successfully" });
  }
};






