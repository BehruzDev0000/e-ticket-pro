import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js";
const router = Router();

const controller= new CustomerController();
router
.post('/',controller.createCustomer)
.get('/',controller.getAllCustomers)
.get('/:id',controller.getCustomerById)
.patch('/:id',controller.updateCustomerById)
.delete('/:id',controller.deleteCustomerById)

export default router