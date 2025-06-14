import { Schema,model } from "mongoose"

const TransportSchema = new Schema({
    transport_type:{type:String,required:true,enum:['avtobus','poyezd','samolyot']},
    class:{type:String,required:true,enum:['ekonom','business','premium']},
    seat:{type:Number,required:true},
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
TransportSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'transport_id'
});



export default model('Transport', TransportSchema);