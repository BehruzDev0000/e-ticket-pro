import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";
import { isValidObjectId } from 'mongoose';
import { createTransportValidator,updateTransportValidator } from "../validation/transport.validation.js"; 
 
export class TransportController {
    async createTransport(req,res){
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const transport = await Transport.create(value);

            return successRes(res, transport, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }
    async getAllTransports(_, res) {
        try {
            const transports = await Transport.find().populate('tickets');
            return successRes(res, transports);
        } catch (error) {
            return handleError(res, error);
        }
    }
    async getTransportById(req,res){
        try {
            const  id  = req.params.id;
            await TransportController.findTransportById(res, id);
            const transport = await Transport.findById(id).populate('tickets');
            return successRes(res, transport);
        } catch (error) {
            return handleError(res, error);
            
        }
    }
    async updateTransportById(req,res){
        try {
            const id = req.params.id;
            const {value,error}=updateTransportValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            
            await TransportController.findTransportById(res, id);
            const updatedTransport=await Transport.findByIdAndUpdate(id,value,{new:true})
            return successRes(res, updatedTransport);
        } catch (error) {
            return handleqError(res, error);
        }
    }
   async deleteTransportById(req, res) {
    try {
        const id = req.params.id;

       await TransportController.findTransportById(res, id);
        await Transport.findByIdAndDelete(id);
        await Ticket.deleteMany({ transport_id: id });

        return successRes(res, { message: 'Transport deleted successfully' }, 200);
    } catch (error) {
        return handleError(res, error);
    }
}

    static async findTransportById(res, id) {
    if (!isValidObjectId(id)) {
        return handleError(res, 'Invalid ObjectId', 400); 
    }
    const transport = await Transport.findById(id);
    if (!transport) {
        return handleError(res, 'Transport not found', 404); 
    }
    return transport; 
}

}