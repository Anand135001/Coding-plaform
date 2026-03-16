const Problem = require("../models/problemModel");
const Submission = require("../models/submissionModel");
const {
  getlanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

// ===== Judge Zero response mapping =====
function mapJudgeStatus(statusId) {
  switch (statusId) {
    case 3:
      return "accepted";
    case 4:
      return "wrong";
    case 5:
      return "time_limit_exceeded";
    case 6:
      return "compilation_error";
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return "runtime_error";
    default:
      return "error";
  }
}

// === submit code ===
const submitCode = async (req, res) => {
  let submitCodeInDb = null;

  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("fields missing");
    }

    if (language === "cpp") {
      language = "c++";
    }

    const languageId = getlanguageById(language);

    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    // ===== Fetch problem =====
    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const hiddenTests = problem.hiddenTestCases || [];

    // ===== Create pending submission =====
    submitCodeInDb = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesTotal: hiddenTests.length,
      status: "pending",
    });

    // ===== Prepare judge0 batch =====
    const submissions = hiddenTests.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);

    if (!submitResult) {
      throw new Error("Judge submission failed");
    }

    const tokens = submitResult.map((v) => v.token);

    const testResult = await submitToken(tokens);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResult) {
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);

      const statusId = test.status?.id;

      if (statusId === 3) {
        testCasesPassed++;
        continue;
      }

      status = mapJudgeStatus(statusId);
      errorMessage = test.compile_output || test.stderr || test.message || null;

      break;
    }

    // ===== Update submission =====
    submitCodeInDb.status = status;
    submitCodeInDb.testCasesPassed = testCasesPassed;
    submitCodeInDb.runtime = runtime;
    submitCodeInDb.memory = memory;
    submitCodeInDb.errorMessage = errorMessage;

    await submitCodeInDb.save();

    // ===== Update solved problems =====
    if (status === "accepted") {
      const alreadySolved = req.result.problemSolved.some(
        (id) => id.toString() === problemId,
      );

      if (!alreadySolved) {
        req.result.problemSolved.push(problemId);
        await req.result.save();
      }
    }

    res.status(200).json({
      accepted: status === "accepted",
      status,
      passedTestCases: testCasesPassed,
      totalTestCases: hiddenTests.length,
      runtime,
      memory,
      error: errorMessage,
    });
  } catch (err) {
    console.error("Submit Error:", err);

    if (submitCodeInDb) {
      submitCodeInDb.status = "error";
      submitCodeInDb.errorMessage = err.message;
      await submitCodeInDb.save();
    }

    res.status(500).json({
      message: "Error in submission",
      error: err.message,
    });
  }
};

// === run code ===
const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("fields missing");
    }

    if (language === "cpp") {
      language = "c++";
    }

    const languageId = getlanguageById(language);

    if (!languageId) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const visibleTests = problem.visibleTestCases || [];

    const submissions = visibleTests.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);

    const tokens = submitResult.map((v) => v.token);

    const testResult = await submitToken(tokens);

    let allPassed = true;
    let runtime = 0;
    let memory = 0;

    for (const test of testResult) {
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);

      if (test.status?.id !== 3) {
        allPassed = false;
      }
    }

    res.status(200).json({
      success: allPassed,
      testCases: testResult,
      runtime,
      memory,
      totalTestCases: testResult.length,
      passedTestCases: testResult.filter((test) => test.status?.id === 3)
        .length,
    });
  } catch (err) {
    console.error("Run code error:", err);

    res.status(500).json({
      success: false,
      error: "Error running code: " + err.message,
    });
  }
};

module.exports = { submitCode, runCode };
