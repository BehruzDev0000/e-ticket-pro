import { successRes } from "../helpers/success.response.js";
import { handleError } from "../helpers/error.handle.js";
import {Crypto} from "../utils/encrypt-decrypt.js";
import Admin from "../models/admin.model.js";
import { adminValidator } from "../validation/admin.validation.js";
export class AdminController {
async createAdmin(req, res) {
  try {
    const { value, error } = adminValidator(req.body);
    if (error) {
      return handleError(res, error, 422);
    }

    const existsUsername = await Admin.findOne({ username: value.username });
    if (existsUsername) {
      return handleError(res, "Username already exists", 409);
    }

    const hashedPassword = await Crypto.encrypt(value.password);

    const admin = await Admin.create({
      username: value.username,
      hashedPassword,
    });

    return successRes(res, admin, 201);
  } catch (error) {
    return handleError(res, error);
  }
}
async getAllAdmins(_, res) {
  try {
    const admins = await Admin.find()
    return successRes(res, admins,200);
  } catch (error) {
    return handleError(res, error);
  }
} 
async getAdminById(req, res){
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return handleError(res, 'Admin not found', 404);
    }
    return successRes(res,admin,200)
  } catch (error) {
    return handleError(res, error);
  }
} 
async updateAdmin(req,res){
  try {
     const { id } = req.params;
    const admin=await Admin.findById(id)
    if (!admin) {
      return handleError(res, 'Admin not found', 404);
    }

    const { value, error } = adminValidator(req.body);
    if (error) {
      return handleError(res, error, 422);
    }
    let hashedPassword=Admin.hashedPassword;
    if (value.password) {
      hashedPassword = await Crypto.encrypt(value.password);
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(id, {
      ...value,hashedPassword
    },
     { new: true });
     return successRes(res, updatedAdmin,200);
  } catch (error) {
    return handleError(res.error)
  }
}
async deleteAdmin(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return handleError(res, 'Admin not found', 404);
    }
    return successRes(res, 'Admin deleted successfully',200);
  } catch (error) {
    return handleError(res, error);
  }
}
}