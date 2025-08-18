const express = require('express');
const userMiddleware = require('../middleware/userAuthMiddleware');
const authRouter = express.Router();
const {register, login, logout} = require('../controllers/userAuthController')

authRouter.post("/register", register);
authRouter.post('/login', login);
authRouter.post("/logout", userMiddleware, logout);
// authRouter.get("/getprofile", getprofile);


module.exports= authRouter;