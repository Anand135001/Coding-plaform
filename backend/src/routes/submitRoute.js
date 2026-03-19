const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require("../middleware/userAuthMiddleware");
const { submitCode, runCode } = require("../controllers/userSubmissionController");
const rateLimiter = require("../middleware/submitRateLimter");

submitRouter.post("/submit/:id", userMiddleware, rateLimiter(1, 15,"submit"), submitCode);
submitRouter.post("/run/:id", userMiddleware, rateLimiter(2, 20, "run"), runCode);

module.exports = submitRouter;
