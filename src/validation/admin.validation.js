import Joi from 'joi';

export const createAdminValidator=(data)=>{
    console.log(data)
    const admin=Joi.object({
        username:Joi.string().min(4).required(),
        password:Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
    })
    return admin.validate(data)
}
export const updateAdminValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).optional(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*d)(?=.*[$-,/@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/).optional()
    });
    return admin.validate(data);
}