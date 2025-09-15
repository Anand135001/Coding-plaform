const {getlanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const problem  = require("../models/problemModel");

const createProblem = async(req, res) => {
    
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      starterCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    try{
      
      for(const {language, completeCode} of referenceSolution){
        
        const languageId = getlanguageById(language);

        // === batch for submission on judge-zero ===
        const submission = visibleTestCases.map((testcase) => ({
            source_code: completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
         
        // === Code submission on judge 0 / response array of tokens ===
        const submitResult = await submitBatch(submission);
        // === converting array of objects(tokens) into array of string ===
        const resultToken = submitResult.map((value) => value.token);
        // === submit tokens to judge 0 ===
        const testResult = await submitToken(resultToken);
         
        for(const test of testResult){
          if(test.status_id!=3){
            return res.status(400).send("Error occrued")
          }
        }
      
      }

      // store in db
      const userproblem = await problem.create({
        ...req.body,
        problemCreator: req.result._id
      });
      
      res.status(201).send("Problem saved!");
      
    }
    catch(err){
      res.status(400).send("Error:", +err);
    }
}

module.exports = createProblem;
