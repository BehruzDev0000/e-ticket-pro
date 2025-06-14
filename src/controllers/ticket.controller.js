import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import Ticket from "../models/ticket.model.js";
import Transport from "../models/transport.model.js";
import { isValidObjectId } from 'mongoose';
import { createTicketValidator, updateTicketValidator } from "../validation/ticket.validation.js";

export class TicketController {
async createTicket(req, res) {
    try {
        const { value, error } = createTicketValidator(req.body);
        if (error) {
            return handleError(res, error, 422);
        }

        if (!isValidObjectId(value.transport_id)) {
            return handleError(res, 'Invalid ObjectId', 400);
        }

        const transport = await Transport.findById(value.transport_id);
        const ticketCount = await Ticket.countDocuments({ transport_id: value.transport_id });

        if (ticketCount >= transport.seat) {
            return handleError(res, 'Barcha o‘rinlar band', 400);
        }

        const ticket = await Ticket.create(value);
        return successRes(res, ticket, 201);

    } catch (error) {
        return handleError(res, error);
    }
}

  async getAllTickets(_,res){
    try {
        const tickets=await Ticket.find().populate('transport_id').populate('customer_id');
        return successRes(res, tickets);
    } catch (error) {
        return handleError(res,error)
    }
  }
  async getTicketById(req,res){
    try {
        const ticket=await TicketController.findTicketById(res,req.params.id)
        return successRes(res,ticket)
    } catch (error) {
        return handleError(res,error)
    }
  }
  async updateTicket(req , res){
    try {
        const id = req.params.id;
        const { value, error } = updateTicketValidator(req.body);
        if (error) {
            return handleError(res, error, 422);
        }
        if (!isValidObjectId(value.transport_id)) {
            return handleError(res, 'Invalid ObjectId', 400);
        }
        await TicketController.findTicketById(res, id);
        const updatedTicket = await Ticket.findByIdAndUpdate(id, value, { new: true }).populate('transport_id').populate('customer_id');
        return successRes(res, updatedTicket);
    } catch (error) {
        return handleError(res,error)
    }
  }
  async deleteTicketById(req, res){
    try {
        const id = req.params.id;
        await TicketController.findTicketById(res, id);
        await Ticket.findByIdAndDelete(id);
        return successRes(res, {message:'Ticket deleted successfully'}, 200);
    } catch (error) {
        return handleError(res,error)
    }
  }
   static async findTicketById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid ObjectId', 400);
            }
            const ticket = await Ticket.findById(id).populate('transport_id').populate('customer_id');
            if (!ticket) {
                return handleError(res, 'Ticket not found', 404);
            }
            return ticket;
        } catch (error) {
            return handleError(res, error);
        }
    }
}
