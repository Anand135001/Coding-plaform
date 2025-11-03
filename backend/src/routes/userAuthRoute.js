const express = require('express');
const userMiddleware = require('../middleware/userAuthMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile, check} = require('../controllers/userAuthController')

authRouter.post("/register", register);
authRouter.post('/login', login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
authRouter.delete('profile',  userMiddleware, deleteProfile);
authRouter.get("/checkAuth", userMiddleware, check);
// authRouter.get("/getprofile", getprofile);


module.exports= authRouter;