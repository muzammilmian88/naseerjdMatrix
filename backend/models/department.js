//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const departmentSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  organization_id: { 
    type: mongoose.Schema.Types.ObjectId,
    ref:'Organization', 
    default:null
  },
  short_name: { type:String,default:null},
  parent_department_id: { type: mongoose.Schema.Types.ObjectId,default:null},
  deleteStatus: { type: Boolean, default: false },
},{
  timestamps:true
}
);

//To use our schema definition, we need to convert our departmentSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Department", departmentSchema);
