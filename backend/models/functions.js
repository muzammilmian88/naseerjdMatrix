//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const functionSchema = mongoose.Schema({
  name: { type: String , required:true },
  parent_template_id: 
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'template',
        default:null
    }
  ,
  parent_function_id: 
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'function',
        default:null
    }
  ,
  deleteStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Function", functionSchema);





