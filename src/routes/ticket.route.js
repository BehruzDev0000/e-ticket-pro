import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
const router = Router();

const controller = new TicketController();
router
    .post('/',controller.createTicket)
    .get('/',controller.getAllTickets)
    .get('/:id',controller.getTicketById)
    .patch('/:id',controller.updateTicket)
    .delete('/:id',controller.deleteTicketById)

    export default router;