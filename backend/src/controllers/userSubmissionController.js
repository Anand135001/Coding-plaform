const Problem =  require('../models/problemModel');
const Submission = require('../models/submissisonModel');
const { getlanguageById, submitBatch, submitToken,} = require("../utils/problemUtility");

const submitCode = async(req, res) => {
     
    try{
        const userId = req.result._id;
        const problemId = req.params._id;

        const {code, language} = req.body;

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("fields missing");
        }

        // ===== fetch problem to get info =====
        const problemfind = await Problem.findById(problemId);
        
        // ===== submit Code result and store in DB ====
        const submitCodeInDb = await Submission.create({
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

        res.status(200).send(submitCodeInDb);
    }   
    catch(err){
        res.status(500).send("Error", +err);
    }
}

module.exports = submitCode;


// language_id: 63,
//     stdin: '123',
//     expected_output: '6',
//     stdout: '6\n',
//     status_id: 3,
//     created_at: '2025-09-22T05:27:21.603Z',
//     finished_at: '2025-09-22T05:27:21.973Z',
//     time: '0.023',
//     memory: 7332,
//     stderr: null,
//     token: 'f52ee288-c1d9-4071-9fe3-b3f398a51aef',
//     number_of_runs: 1,