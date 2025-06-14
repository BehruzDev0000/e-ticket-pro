import {model,Schema,Types} from 'mongoose';

const passportInfoSchema = Schema({
    serial:{type:String,required:true,trim:true,uppercase:true},
    jshshir:{type:String,required:true,unique:true,length:14},
    full_name:{type:String,required:true,trim:true},
    customer_id:{type:Types.ObjectId,ref:'Customer',required:true},
})
export default model('PassportInfo', passportInfoSchema);