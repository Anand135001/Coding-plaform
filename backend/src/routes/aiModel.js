const express = require('express');
const aiRouter = express.Router();
const userAuthMiddleware = require('../middleware/userAuthMiddleware');
const solveQuery = require('../controllers/solveQueryController');

aiRouter.post('/chat', userAuthMiddleware, solveQuery);

module.exports = aiRouter;