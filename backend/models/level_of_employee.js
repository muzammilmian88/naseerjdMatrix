//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const levelOfEmployeeSchema = mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'StaffType',
    required: true
  },
  designation: { 
    type: mongoose.Schema.Types.ObjectId,
    ref:'Designation',
    required:true
  },
  level_grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Tier',
    default:null
  },
  deleteStatus: {
    type: Boolean,
    default: false
  },
},{
  timestamps:true
}
);

//To use our schema definition, we need to convert our levelOfEmployeeSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Level_of_employee", levelOfEmployeeSchema);
