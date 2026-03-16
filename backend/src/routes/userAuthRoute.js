const express = require('express');
const userMiddleware = require('../middleware/userAuthMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");
const authRouter = express.Router();
const {register, login, logout, adminRegister, deleteProfile, check, getProfile} = require('../controllers/userAuthController')

authRouter.post("/register", register);
authRouter.post('/login', login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
authRouter.delete('/profile',  userMiddleware, deleteProfile);
authRouter.get("/check", userMiddleware, check);
authRouter.get("/profile", userMiddleware ,getProfile);

module.exports= authRouter;