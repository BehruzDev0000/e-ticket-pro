import Joi from 'joi';

export const adminValidator=(data)=>{
    console.log(data)
    const admin=Joi.object({
        username:Joi.string().min(4).required(),
        password:Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
    })
    return admin.validate(data)
}