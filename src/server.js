import express from 'express'
import {config} from 'dotenv'
config()
import {createSuperAdmin} from './db/create-superadmin.js'
import { connectDB } from './db/main.js'
import adminRouter from './routes/admin.route.js'

const  PORT=Number(process.env.PORT)
const app=express()
await connectDB()
await createSuperAdmin()
app.use(express.json())
app.use('/admin',adminRouter)
app.listen(PORT,()=>console.log(`Server running on ${PORT} port`))