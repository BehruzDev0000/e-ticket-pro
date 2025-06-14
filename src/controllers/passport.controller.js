import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import Passport from '../models/pasport-info.js'
import { isValidObjectId } from "mongoose";
import { createPassportValidator, updatePassportValidator } from "../validation/passport-info.validation.js";

export class PassportController {
    async createPassport(req,res){
        try {
            const {value,error}=createPassportValidator(req.body)
            if(error){
                return handleError(res,error,422)
            }
            if(!isValidObjectId(value.customer_id)){
                return handleError(res,'Invalid ObjectId',400)
            }
            const passport = await Passport.create(value)
            return successRes(res,passport,201)
        } catch (error) {
            return handleError(res, error)
        }
    }
    async getAllPassports(_,res){
        try {
            const passports= await Passport.find().populate('customer_id')
            return successRes(res,passports)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async getPassportById(req,res){
        try {
            const passport = await Passport.findById(req.params.id).populate('customer_id')
            if(!passport){
                return handleError(res,'Passport not found',404)
            }
            return successRes(res,passport)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async updatePassportById(req,res){
        try {
            const id = req.params.id;
            const {value,error}=updatePassportValidator(req.body)
            if(error){
                return handleError(res,error,422)
            }
            await PassportController.findPassportById(res, id);
            const updatedPassport = await Passport.findByIdAndUpdate(id, value, { new: true })
            return successRes(res,updatedPassport)
        } catch (error) {
            return handleError(res,error)
        }
    }
    async deletePassportById(req,res){
        try {
            const id = req.params.id;
            const passport = await Passport.findByIdAndDelete(id)
            return successRes(res,'Passport deleted successfully')
        } catch (error) {
            return handleError(res,error)
        }
    }
    static async findPassportById(res,id){
        if(!isValidObjectId(id)){
            return handleError(res,'Invalid ObjectId',400)
        }
        const passport = await Passport.findById(id)
        if(!passport){
            return handleError(res,'Passport not found',404)
        }
        return passport
    }
}