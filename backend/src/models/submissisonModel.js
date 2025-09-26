const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem", 
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["c++", "java", "javascript", "python"], 
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "wrong",
        "error",
        "time_limit_exceeded",
      ],
      required: true,
    },
    runtime: {       //time complexity
      type: Number, 
      default: 0,
    },
    memory: {        //space complexity
      type: Number, 
      default: 0,
    },
    errorMessage: {
      type: String,
      deafault: null,
    },
    testCasesPassed: {
      type: Number,
      default: 0
    },
    testCasesTotal: {
      type: Number,
      deafault: 0
    }
  },
  { timestamps: true } 
);

const Submission = mongoose.model("submission", submissionSchema);

module.exports = Submission;