import mongoose from "mongoose";
import Tier from "../models/tier.js";
import Designation from "../models/designation.js";

export const getTiers = async (req, res) => {
  try {
    const tiers = await Tier.find({ deleteStatus: false });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getTiersByDesignation = async (req, res) => {
  const designation=req.params.designation;
  try {
    const tiers = await Tier.find({ deleteStatus: false,designation:designation });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRecycleTiers = async (req, res) => {
  try {
    const tiers = await Tier.find({ deleteStatus: true });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTier = async (req, res) => {
  const tier = req.body;
  
  try {
    const existingTier = await Tier.findOne({
      level_grade: tier?.level_grade,
      
    });
    // console.log(existingTier);
    if (existingTier) {
      if (!existingTier?.deleteStatus) {
        return res.status(201).send({error:true, message: "Grade already exist" });
      } else {
        const updateTier = await Tier.findByIdAndUpdate(
          existingTier?._id,
          { deleteStatus: false },
          {
            new: true,
          }
        );
        return res.status(200).json({error:false, message:"Tier Updated Successfully"});
      }
    }
    const newTier = new Tier({ ...tier });
    await newTier.save();
    res.status(200).json({error:false, message:"Tier Added Successfully"});
  } catch (error) {
    res.status(404).json({error:true, message: error.message });
  }
};

export const updateTier = async (req, res) => {
  const id = req.params.id;
  const tier = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({error:true,message:"No tier with that id"});
  try {
    const existingTier = await Tier.findOne({
      level_grade: tier?.level_grade,
      _id: { $ne: id },
    });
    if (existingTier) {
      if (!existingTier?.deleteStatus) {
        return res.status(201).send({error:true, message: "Grade already exist" });
      } else {
        await Tier.findByIdAndRemove(existingTier?._id);
      }
    }
    const updateTier = await Tier.findByIdAndUpdate(id, tier, {
      new: true,
    });
    res.status(200).json({error:false, message:"Tier Updated Successfully"});
  } catch (error) {
    res.status(404).json({ error:true, message: error.message });
  }
};

export const deleteTier = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No tier with that id");
  const deleteTier = await Tier.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    {
      new: true,
    }
  );
  res.status(200).json(deleteTier);
};

export const deleteTiers = async (req, res) => {
  try {
    await Tier.updateMany(
      { deleteStatus: false },
      {
        $set: { deleteStatus: true },
      }
    );
    const tiers = await Tier.find({ deleteStatus: false });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const restoreTier = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No tier with that id");
  await Tier.findByIdAndUpdate(
    id,
    { deleteStatus: false },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Tier restored successfully" });
};

export const restoreTiers = async (req, res) => {
  try {
    await Tier.updateMany(
      { deleteStatus: true },
      {
        $set: { deleteStatus: false },
      }
    );
    const tiers = await Tier.find({ deleteStatus: true });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const permanentDeleteTier = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No tier with that id");
    const designationcount = await Designation.countDocuments({level_grade:id});
  if(designationcount){
    res.status(404).json({message:"Cannot delete Grade/Level because it is used in  designation"});
  }else{
    await Tier.findByIdAndRemove(id);
    res.status(200).json({error:false, message: "Tier deleted successfully" });
  }
  
};

export const permanentDeleteTiers = async (req, res) => {
  try {
    await Tier.deleteMany({
      deleteStatus: true,
    });
    const tiers = await Tier.find({ deleteStatus: true });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
