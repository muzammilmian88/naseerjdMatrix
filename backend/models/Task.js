//Mongoose provides a straight-forward, schema-based solution to model your application data.
import mongoose from "mongoose";

//Everything in Mongoose starts with a Schema.
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const taskSchema = mongoose.Schema({
  name: { type: String , required:true },
  function_id: { type:mongoose.Schema.Types.ObjectId , required:true, ref:'function' },
  parent_task_id: [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'task',
        default:null
    }
  ],
  deleteStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
});

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//To do so, we pass it into mongoose.model(modelName, schema)
export default mongoose.model("Task", taskSchema);





