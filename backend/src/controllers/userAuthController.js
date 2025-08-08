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
        req.body.password = bcrypt.hash(password, 10);

        const user = await User.create(req.body);
        // ==== Token =====
        const token = jwt.sign({_id:user._id, emailID: emailID}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('jwt', token, {maxAge: 60*60*1000});
        res.status(201).send("User register Successfully");
        
    }

    catch(err){
        res.status(400).send("Error: "+err);
    }
}