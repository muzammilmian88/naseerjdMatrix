//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const tierSchema = new mongoose.Schema({
    level_grade: {
      type: String,
      required: true
    },
  });

//To use our schema definition, we need to convert our tierSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Tier", tierSchema);
