const express =  require("express");
const submitRouter = express.Router();

const userMiddleware = require("../middleware/userAuthMiddleware");
const {submitCode, runCode}  = require("../controllers/userSubmissionController");

submitRouter.post("/run/:id", userMiddleware, runCode);
submitRouter.post("/submit/:id", userMiddleware, submitCode);

module.exports = submitRouter;