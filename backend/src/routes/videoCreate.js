const express =  require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const { generateUploadSignture, saveVideoMetaData, deleteVideo } = require("../controllers/videosCreateController");

const videoRouter =  express.Router();

videoRouter.get("/create/:problemId", adminMiddleware, generateUploadSignture);
videoRouter.post("/save", adminMiddleware, saveVideoMetaData);
videoRouter.delete("/delete/:problemId", adminMiddleware, deleteVideo);

module.exports = videoRouter;