import nodemailer from 'nodemailer'
import config from '../config/main.js';

 export const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,

  port: config.MAIL_PORT,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD
  },
  secure:true
});
