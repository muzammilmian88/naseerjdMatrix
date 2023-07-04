//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const designationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    shortname: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    staff_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'StaffType',
      required: true
    },
    level_grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Tier',
      required: true
    }
  });

//To use our schema definition, we need to convert our designationSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Designation", designationSchema);
