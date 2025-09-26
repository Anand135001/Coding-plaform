const Problem =  require('../models/problemModel');
const Submission = require('../models/submissisonModel');
const { getlanguageById, submitBatch, submitToken,} = require("../utils/problemUtility");

const submitCode = async(req, res) => {
    let submitCodeInDb = null
   
    try{
        const userId = req.result._id;
        const problemId = req.params.id;
        const {code, language} = req.body;

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("fields missing");
        }

        // ===== fetch problem to get info =====
        const problemfind = await Problem.findById(problemId);
        
        // ===== submit Code result and store in DB ====
        submitCodeInDb = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesTotal: problemfind.hiddenTestCases.length,
            status: 'pending'
        })

        const languageId = getlanguageById(language);

        const submission = problemfind.hiddenTestCases.map((testcase) => ({
                            source_code: code,
                            language_id: languageId,
                            stdin: testcase.input,
                            expected_output: testcase.output
                        }));
                  
        const submitResult = await submitBatch(submission);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);
               
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null

        for(const test of testResult){
            if(test.status_id == 3){
               testCasesPassed++;
               runtime += parseFloat(test.time);
               memory = Math.max(memory, test.memory);
            }
            else{
                if(test.status_id == 4){
                   status = 'error';
                   errorMessage = test.stderr;
                }
                else{
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
            }
        }
        
        // ==== update pending submitted code result in Database ====
        submitCodeInDb.status = status;
        submitCodeInDb.testCasesPassed = testCasesPassed;
        submitCodeInDb.runtime = runtime;
        submitCodeInDb.memory = memory;
        submitCodeInDb.errorMessage = errorMessage
        
        await submitCodeInDb.save();
        
        // ==== Update solved problem at user profile ====
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        res.status(200).send(submitCodeInDb);
    }   
    catch(err){
    console.error("Submit Error:", err);

    if (submitCodeInDb) {
      submitCodeInDb.status = "error";
      submitCodeInDb.errorMessage = err.message;
      await submitCodeInDb.save();
    }
    res.status(500).send({ message: "Error in submission", error: err.message });
    }
}

module.exports = submitCode;


