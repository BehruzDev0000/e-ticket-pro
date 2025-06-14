import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import Customer from "../models/customer.model.js";
import { createCustomerValidation, updateCustomerValidation } from "../validation/customer.validation.js";
import {Token} from "../utils/token.service.js"; 
const token = new Token();
export class CustomerController {
    async signUp(req,res){
        try {
            const {value,error}=createCustomerValidation(req.body)
            if(error){
                return handleError(res,error,422)
            }
            const existsPhoneNumber = await Customer.findOne({ phone_number: value.phone_number });
            if (existsPhoneNumber) {
                return handleError(res, 'Phone number already exists', 409);
            }
             const customer = await Customer.create(value);
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return successRes(res, {
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            return handleError(res,error)
        }
    }
    async getAllCustomers(_,res){
        try {
            const customers=await Customer.find()
            return successRes(res,customers)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async getCustomerById(req,res){
        try {
            const customer= await Customer.findById(req.params.id)
            if(!customer){
                return handleError(res,'Customer not found',404)
            }
            return successRes(res,customer)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async updateCustomerById(req,res){
        try {
            const id = req.params.id;
            const {value,error}=updateCustomerValidation(req.body)
            if(error){
                return handleError(res,error,422)
            }
            await CustomerController.findCustomerById(res, id);
            const updatedcustomer = await Customer.findByIdAndUpdate(id, value, { new: true})
            return successRes(res,updatedcustomer)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async deleteCustomerById(req,res){
        try {
            const customer = await Customer.findByIdAndDelete(req.params.id)
            if (!customer) {
                return handleError(res, 'Customer not found', 404)
            }
            return successRes(res,'Customer deleted successfully')
        } catch (error) {
            return handleError(res,error)
        }
    }
    static async findCustomerById(res, id) {
        try {
            const customer = await Customer.findById(id);
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            }
            return customer;
        } catch (error) {
            return handleError(res, error);
        }
    }
}
