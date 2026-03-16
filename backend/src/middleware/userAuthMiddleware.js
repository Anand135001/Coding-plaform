const jwt =  require('jsonwebtoken');
const User = require('../models/userModel');
const redisClient = require('../config/redis');


const userMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;;
        if (!token) {
          return res.status(401).json({
            authenticated: false,
          });
        }
        
        // === check redis blacklist === 
        const isBlocked = await redisClient.exists(`blacklist:${token}`);
        if(isBlocked){
            throw new Error('Invaild token');
        }


        // === verify token ===
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id){
            throw new Error('Id is missing');
        }
        
        const result = await User.findById(_id);
        if(!result){
            throw new Error('User Does not exists');
        }
        req.result = result;
        next();
    }
    catch(err){
      // For JWT errors (expired, invalid), just continue without auth
      console.log("Auth middleware error:", err.message);
      next();
    }
}

module.exports = userMiddleware;