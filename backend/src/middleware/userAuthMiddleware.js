const jwt =  require('jsonwebtoken');
const User = require('../models/userModel');
const redisClient = require('../config/redis');


const userMiddleware = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("You do not have access token");
        }

        
        // === check redis blacklist === 
        const IsBlocked = await redisClient.exists(`blacklist:'${token}`);
        if(IsBlocked){
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