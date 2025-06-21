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
        if (error) return handleError(res, error, 422);

        const { phone_number, email } = value;

        const existingCustomer = await Customer.findOne({ phone_number });
        if (existingCustomer) return handleError(res, 'Phone number already registered');

        const existsEmail = await Customer.findOne({ email });
        if (existsEmail) return handleError(res, 'Email address already registered', 409);

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
        return handleError(res, error);
    }
}

async signIn(req, res) {
    try {
        const { value, error } = signInCustomerValidator(req.body);
        if (error) return handleError(res, error, 422);

        const { email } = value;

        const customer = await Customer.findOne({ email });
        if (!customer) return handleError(res, 'Customer not found', 404);

        const otp = generateOtp();

        const mailOptions = {
            from: config.MAIL_USER,
            to: email,
            subject: 'e-navbat',
            text: `Your OTP: ${otp}`
        };

        await transporter.sendMail(mailOptions); 
        cache.set(email, otp, 120);

        return successRes(res, { message: 'OTP sent successfully to email' });
    } catch (error) {
        return handleError(res, error);
    }
}

async confirmSignIn(req, res) {
    try {
        const { value, error } = confirmSignInCustomerValidator(req.body);
        if (error) return handleError(res, error, 422);

        const { email, otp } = value;

        const customer = await Customer.findOne({ email });
        if (!customer) return handleError(res, 'Customer not found', 404);

        const cacheOTP = cache.get(email);
        if (!cacheOTP || cacheOTP !== otp) return handleError(res, 'OTP expired or invalid', 400);
        cache.del(email)
        const payload = { id: customer._id }; 

        const accessToken = await token.generateAccessToken(payload);
        const refreshToken = await token.generateRefreshToken(payload);

        res.cookie('refreshTokenCustomer', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
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

async newAccessToken(req, res) {
    try {
        const refreshToken = req.cookies?.refreshTokenCustomer;
        if (!refreshToken) return handleError(res, 'Access token expired', 400);
        const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);


        if (!decodedToken) return handleError(res, 'Invalid token', 400);
        
        const customer = await Customer.findById(decodedToken.id);
        if (!customer) return handleError(res, 'Customer not found');
        const accessToken = await token.generateAccessToken({ id: customer._id });
        return successRes(res, { token: accessToken });
    } catch (error) {
        return handleError(res, error);
    }
}

async logOut(req, res) {
    try {
        const refreshToken = req.cookies?.refreshTokenCustomer;
        if (!refreshToken) return handleError(res, 'Access token missing', 401);

        const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
        if (!decodedToken) return handleError(res, 'Invalid token', 401);

        const customer = await Customer.findById(decodedToken.id);
        if (!customer) return handleError(res, 'Customer not found', 404);

        res.clearCookie('refreshTokenCustomer', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        return successRes(res, { });
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
