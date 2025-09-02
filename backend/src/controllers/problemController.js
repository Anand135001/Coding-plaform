const {getlanguageById, submitBatch} = require("../utils/problemUtility");


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
        
        // source code:
        // stadin:
        // expectedOutput
        // language_id:
        const languageId = getlanguageById(language);

        // batch for submission on judge-zero
        const submission = visibleTestCases.map((input, output) => ({
            source_code: completeCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }));
         
        const submitResult = await submitBatch(submissions);

      }
    }
    catch(err){

    }
}



// const submission = {
//   "submissions": [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash"
//     },
//     {
//       "language_id": 71,
//       "source_code": "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": "puts(\"hello from Ruby\")"
//     }
//   ]
// }