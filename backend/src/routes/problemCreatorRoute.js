const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');

const problemRouter = express.Router();

problemRouter.post("/create",adminMiddleware ,CreateProblem);
problemRouter.patch("/:id", adminMiddleware, UpdateProblem);
problemRouter.post("/:id", adminMiddleware, DeleteProblem);

problemRouter.get("/:id", adminMiddleware, GetProblem);
problemRouter.post("/", adminMiddleware, GetAllProblem);
problemRouter.post("/user", adminMiddleware, SolvedProblem);
