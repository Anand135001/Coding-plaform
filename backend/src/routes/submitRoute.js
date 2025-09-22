const express =  require("express");
const submitRouter = express.Router();

const userMiddleware = require("../middleware/userAuthMiddleware");
const { submitCode } = require("../controllers/userSubmissionController");

submitRouter.post("/submit/:id", userMiddleware, submitCode);
