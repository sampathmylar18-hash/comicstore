const jwt = require('jsonwebtoken');

const protect = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message : 'no token provided '})

    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded;
        next()
    }catch(e){
        return res.status(401).json({ message : `invalid or expired token ${e}`})
    }
    }
    
    const isAdmin = (req,res,next)=>{
        if(req.user.role?.trim() !== 'admin'){
            return res.status(403).json({ message : 'admin access required'})
        }
        next();
    }


module.exports = { protect, isAdmin}