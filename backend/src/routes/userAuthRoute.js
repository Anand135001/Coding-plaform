const express = require('express');
const userMiddleware = require('../middleware/userAuthMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");
const authRouter = express.Router();
const {register, login, logout, adminRegister} = require('../controllers/userAuthController')

authRouter.post("/register", register);
authRouter.post('/login', login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
// authRouter.get("/getprofile", getprofile);


module.exports= authRouter;