//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const employeeSchema = mongoose.Schema({
  employee_id: { type: String , default:null },
  name: { type: String,required:true },
  email: { type: String , default:null},
  gender: { type: String,required:true },
  designation: { 
    type:mongoose.Schema.Types.ObjectId,
    ref:'Designation',
    default:null 
  },
  joinning_date: { type: String,required:true },
  current_salary: { type: String,required:true },
  allowance: { type: String,required:true },
  allowance_description: { type: String,required:true },
  profile_image: { type: Object, default:null },
  phone_number: { type: String,required:true },
  departments: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        default:null
    }
  ],role:{
    type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
        required:true
  },
 
  deleteStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Employee", employeeSchema);





