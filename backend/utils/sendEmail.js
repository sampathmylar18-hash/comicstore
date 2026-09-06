const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
})
 async function sendEmail(to, subject , text){
    try{
        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to : to,
            subject : subject ,
            text : text
    
    }) 
    }catch(e){
        console.error(e)
    }
}
module.exports = sendEmail