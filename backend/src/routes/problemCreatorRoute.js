const express = require('express');
const problemRouter = express.Router();

const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userAuthMiddleware')
const {createProblem, updateProblem, deleteProblem, getProblem, getAllProblem, solvedAllProblemByUser } = require('../controllers/ProblemController');


problemRouter.post("/create",adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/getProblem/:id", userMiddleware,getProblem);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblemByUser);

module.exports = problemRouter;
