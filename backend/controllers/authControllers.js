const User = require('../models/user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const register = async(req,res)=>{
    try{
        const { name, email, password , role} = req.body;

        const existingUser = await User.findOne({email})
        if (existingUser && existingUser.isVerified ) return res.status(400).json({ message : 'email already register'})

        if (existingUser && !existingUser.isVerified) {
             await User.deleteOne({ email });
        }
        const hashedPassword = await bcrypt.hash(password , 10);
       

        let otp = Math.floor(100000 + Math.random()*900000)
        const otpExpiry = new Date(Date.now() + 10*60*1000)
        const isVerified = false;

         const newUser = await User.create({ name , email , password : hashedPassword , role , otp , otpExpiry ,isVerified})

        sendEmail(newUser.email, "Verify your Account","Your OTP is : "+ otp)

        res.status(201).json({ message : 'Verify the USER', userId : newUser._id})

    }catch(e){
        res.status(500).json({ message : e.message})
    }
}

const login = async(req,res)=>{
    try {
        const { email , password } = req.body

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message : 'invalid email or password'})
            
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({ message : 'invalid email or password'})

        if(user.isVerified == false){
             return res.status(403).json({
                message : "please verify your email first"
            })
        }

        const token = jwt.sign(
            { id :user._id , 
            role : user.role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn : '7d'}
        )

        res.json({token , name : user.name , role : user.role})
        console.log({token , name : user.name , role : user.role})
    }catch(e){
        res.status(500).json({ message : e.message})
    }

}

const verifyOtp = async(req,res)=>{
    try{
        const { email , otp } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(404).json({
                message : "error occured no user"
            }) 
            return;
        }
       if(Number(otp) === user.otp && user.otpExpiry > Date.now()){
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save()
            res.status(200).json({
                message : "Verified OTP",
                verification : user.isVerified
            })
        }else{
            res.status(400).json({
                message : "Invalid/Expired OTP "
            })
        }
        
    }catch(e){
        console.error(e)
        res.status(500).json({message : 'something went wrong'})
    }
}

module.exports = { register , login , verifyOtp}