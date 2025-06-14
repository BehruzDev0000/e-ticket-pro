import {model, Schema,Types} from "mongoose";

const ticketSchema = new Schema({
    transport_id: {type: Types.ObjectId,ref: 'Transport',required: true},
    from:{type: String, required: true,trim:true},
    to:{type: String, required: true,trim:true},
    price:{type:Number,required:true, min: 0},
    departure:{type:Date,required:true},
    arrival:{type:Date,required:true},
    customer_id: {type: Types.ObjectId, ref: 'Customer', required: true},
},{
    timestamps: true
})

export default model('Ticket', ticketSchema);