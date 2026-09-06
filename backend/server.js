require('dotenv').config()
const express = require('express');

const connect = require("./database/database")
const bookroutes = require('./routes/book-routes')
const orderroutes = require('./routes/order-routes')
const authroutes = require('./routes/auth-routes')
const paymentroutes = require('./routes/payment-routes')
const cors = require('cors')
//const bookroutes = require("./routes/book-routes") 

//env
const port = process.env.PORT;
const mongo = process.env.MONGO_URI

//connection call
connect()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/books',bookroutes)
app.use('/api/orders',orderroutes)
app.use('/api/auth', authroutes)
app.use('/api/payment',paymentroutes)


app.listen(port,()=>{
    console.log(`server is now running on port ${port}`)
})
