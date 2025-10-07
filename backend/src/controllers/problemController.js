const {getlanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem  = require("../models/problemModel");
const User = require("../models/userModel");
const Submission = require("../models/submissisonModel");

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
      const userproblem = await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });
      
      console.log("all 201 good");
      res.status(201).send("Problem saved!");
      
    }
    catch(err){
      res.status(400).send("Error: " + err.message);
    }
}

const updateProblem = async (req,res) => {
  
  const {id} = req.params;
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

      if(!id){
        return res.status(400).send("Invaild ID");
      }
      
      const DsaProblem = await Problem.findById(id);
      if(!DsaProblem){
        return res.status(404).send("problem not found");
      }
    
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getlanguageById(language);

        const submission = visibleTestCases.map((testcase) => ({
          source_code: completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submission);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id != 3) {
            return res.status(400).send("Error occrued");
          }
        }
      }
      
      // update problem in database 
      const changedProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators: true, new:true});
      
      res.status(200).send(changedProblem);
  }
  catch(err){
    res.status(400).send("Error", +err);
  }
}

const deleteProblem = async (req,res) => {

  const {id} = req.params;
  
  try{
     
    if(!id){
      return res.status(400).send("ID missing");
    }
    const problemDelete = await Problem.findByIdAndDelete(id);
    
    if(!problemDelete){
      return res.status(404).send("Problem is Not present");
    }
    return res.status(200).send("problem deleted successfully");

  }
  catch(err){
    res.status(500).send("Error", +err.messager);
  }
}

const getProblem = async (req, res) => {
   
   const {id} = req.params;

   try{
      if(!id){
        return res.status(400).send("ID missing");
      }
      const findProblem = await Problem.findById(id).select('title description tags visibleTestCases starterCode');

      if(!findProblem){
        return res.status(400).send("Problem is Missing");
      }

      res.status(200).send(findProblem);
   }
   catch(err){
      res.status(500).send("Error", +err);
   }
}

const getAllProblem = async (req, res) => {

  try{
    const findAllProblem = await Problem.find({}).select('_id title tags difficulty');
    
    if(!findAllProblem || findAllProblem.length==0){
      return res.status(404).send("Problem is Missing");
    }

    res.status(200).send(findAllProblem);
  }
  catch(err){
    res.status(500).send("Error", err.message);
  }
}

const solvedAllProblemByUser = async (req, res) => {
    
  const userId = req.result._id;
   
  if(!userId){
    return res.status(400).send("invaild user id");
  }

  const solvedProblems = await User.find(userId).populate({
    path:"problemSolved",
    select:"_id title difficulty tags"
  });

  return res.status(200).send(solvedProblems);
}

const submittedProblem = async (req, res) => {
  
  try{
    const userId = req.result._id;
    const problemId = req.params.pid;
    
    const ans = await Submission.find({userId, problemId});

    if(ans.length == 0){
      res.status(200).send('No submission is present');
    }
    res.status(200).send(ans);

  }
  catch(err){
    res.status(500).send("Internal server error");
  }
}

module.exports = {createProblem, updateProblem, deleteProblem, getProblem, getAllProblem, solvedAllProblemByUser, submittedProblem };
