const mongoose = require ("mongoose")
const dns = require('dns')
dns.setServers(['1.1.1.1','8.8.8.8'])
const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    }catch(e){
        console.error('mongoDB connection error : ',e.message);
        process.exit(1);
    }
}
module.exports = connect;