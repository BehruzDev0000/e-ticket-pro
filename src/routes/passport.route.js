import { Router } from "express";
import { PassportController } from "../controllers/passport.controller.js";

const router= Router();
const contoller = new PassportController()

router
    .post('/',contoller.createPassport)
    .get('/',contoller.getAllPassports)
    .get('/:id',contoller.getPassportById)
    .patch('/:id',contoller.updatePassportById)
    .delete('/:id',contoller.deletePassportById)

export default router;