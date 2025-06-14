import express from 'express'
import {config} from 'dotenv'
config()
import {createSuperAdmin} from './db/create-superadmin.js'
import { connectDB } from './db/main.js'
import adminRouter from './routes/admin.route.js'
import transportRouter from './routes/transport.route.js'
import ticketRouter from './routes/ticket.route.js'
import customerRouter from './routes/customer.route.js'
import passportRouter from './routes/passport.route.js'

const  PORT=Number(process.env.PORT)
const app=express()
await connectDB()
await createSuperAdmin()
app.use(express.json())
app.use('/admin',adminRouter)
app.use('/transport',transportRouter)
app.use('/ticket',ticketRouter)
app.use('/customer',customerRouter)
app.use('/passport',passportRouter)

app.listen(PORT,()=>console.log(`Server running on ${PORT} port`))