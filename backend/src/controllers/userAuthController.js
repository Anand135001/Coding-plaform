const User = require("../models/userModel");
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const redisClient = require("../config/redis");


const register = async(req, res) => {
    
    try{
        const errors = validate(req.body);
        
        const { firstname, emailID, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);
        
        // ==== Token =====
        const token = jwt.sign({_id:user._id, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {
            maxAge: 60*60*1000,
            httpOnly: true,
            secure: process.env.NODE_ENV,
        });
        res.status(201).send("User register Successfully");
        
    }
    catch(err){
        res.status(400).json({ error: "Registration failed" }); 
        console.error(err); 
    }
}


const login = async (req, res) => {
    
    try{
        const {emailID, password} = req.body;

        if (!emailID || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({emailID});
        if(!user){
            return res.status(401).json({error: "invaild credentials"})
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            throw new Error("invaild Credentials"); 
        }
        const token = jwt.sign({_id:user._id, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
        
        res.cookie("token", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV,
        });
        res.status(201).send("login Successfully");
    }
    catch(err){
        res.status(401).send("Error:" +err);
    }
}


const logout = async (req, res) => {
          
    try{
        const {token} = req.cookies;
        if (!token) return res.status(400).send("No token found");

        const decoded = jwt.decode(token);
        if(!decoded || !decoded.exp) return res.status(400).send("invaild token");

        // === store token in radis blacklist ===
        await redisClient.set(`blacklist:${token}`, 'true');
        await redisClient.expireAt(`blacklist:${token}`, decoded.exp);
        
        // === clear cookies ===
        res.cookie("token", "", { expires: new Date(0), httpOnly: true });
        res.send("logged Out Successfully");
    }
    catch(err){
        res.status(401).send("Error:"+err);
    }
}


const adminRegister = async (req, res) => {
     
    try {
      const errors = validate(req.body);

      const { firstname, emailID, password } = req.body;
      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = "admin";

      const user = await User.create(req.body);

      // ==== Token =====
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: 60 * 60 }
      );
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV,
      });
      res.status(201).send("User register Successfully");
    } catch (err) {
      res.status(400).json({ error: "Registration failed" });
      console.error(err);
    }
}

module.exports = {register, login, logout, adminRegister};