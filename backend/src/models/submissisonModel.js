const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "Problem", 
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "javascript", "python"], 
    },
    Status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Time Limit Exceeded",
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
      type: Number,
      deafault: '',
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

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;