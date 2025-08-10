const User = require("../models/userModel");
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');


const register = async(req, res) => {
    
    try{
        const errors = validate(req.body);
        if(errors.length > 0){
           return res.status(400).json({errors});
        }
        
        const { firstname, emailID, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);
        // ==== Token =====
        const token = jwt.sign({_id:user._id, emailID: emailID}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('jwt', token, {
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

        const token = jwt.sign({_id:user._id, emailID: emailID}, process.env.JWT_KEY, {expiresIn: 60*60});
        
        res.cookie("jwt", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV,
        });
        res.status(201).send("User register Successfully");
    }
    catch(err){
        res.status(401).send("Error:" +err);
    }
}


