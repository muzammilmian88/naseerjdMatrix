//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const staffTypeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    shortname: {
      type: String,
      required: true
    }
  });

//To use our schema definition, we need to convert our staffTypeSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("StaffType", staffTypeSchema);
