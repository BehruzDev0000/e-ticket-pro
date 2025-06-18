import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import Customer from "../models/customer.model.js";
import { confirmSignInCustomerValidator, createCustomerValidation, signInCustomerValidator, updateCustomerValidation } from "../validation/customer.validation.js";
import {Token} from "../utils/token.service.js"; 
import NodeCache from "node-cache";
import { generateOtp } from "../helpers/generate-otp.js";
import { transporter } from "../helpers/send-mail.js";
import  config  from "../config/main.js";

const cache = new NodeCache()
const token = new Token();


export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = createCustomerValidation(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existingCustomer = await Customer.findOne({ phone_number: value.phone_number });
                if (existingCustomer) {
                    return handleError(res,'Phone number already registired');
                    }
            const existsEmail = await Customer.findOne({ email: value.email });
            if (existsEmail) {
                return handleError(res, 'Email address already registred', 409);
            }
            const customer = await Customer.create(value);
            const payload = { id: Customer._id };
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
            return handleError(res, error);
        }
    }

    async signIn(req, res) {
        try {
            const { value, error } = signInCustomerValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const email = value.email;
            const customer = await Customer.findOne({ email });
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            }
            const otp = generateOtp();
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'e-navbat',
                text: otp
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return handleError(res, 'Error on sending to email', 400);
                } else {
                    console.log(info);
                }
            })
            cache.set(email, otp, 120);
            return successRes(res, {
                message: 'OTP sent successfully to email'
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async confirmSignIn(req, res) {
        try {
            const { value, error } = confirmSignInCustomerValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const customer = await Customer.findOne({ email: value.email });
            if (!customer) {
                return handleError(res, 'Customer not found', 404);
            }
            const cacheOTP = cache.get(value.email);
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, 'OTP expired', 400);
            }
            const payload = { id: Customer._id };
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
            return handleError(res, error);
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
