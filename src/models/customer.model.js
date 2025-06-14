import { model,Schema} from "mongoose";

const CustomerSchema = new Schema({
    email:{type:String,required:true,unique:true},
    phone_number:{type:String,unique:true,required:true},
},{
    timestamps:true
})
export default model('Customer', CustomerSchema);