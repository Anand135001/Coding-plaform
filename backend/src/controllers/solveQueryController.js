const { GoogleGenAI } = require("@google/genai");

const solveQuery = async(req, res) => {
    
    try{
        const {messages,title,description, testCases, startCode} = req.body;

        const ai = new GoogleGenAI({apikey: process.env.GEMINI_API_KEY});
          
        async function main() {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: messages,
              config: {
                systemInstruction: `You are an expert coding assistant specializing in algorithmic problem-solving.
                
                ##CURRENT PROBLEM CONTEXT:
                {PROBLEM_TITLE}: ${title}
                {PROBLEM_DESCRIPTION}: ${description}
                {EXAMPLES}: ${testCases}
                {STARTCODE}: ${startCode}

                ROLE & BEHAVIOR:
                1. Analyze coding problems thoroughly using the provided:
                   - Title & Description (understand the problem statement)
                   - Visible Test Cases (identify edge cases and expected behavior)
                   - Start Code (understand the initial implementation approach)
                
                2. Provide solutions that:
                   - Correctly solve all visible test cases
                   - Include clear explanations of the algorithm/logic
                   - Suggest optimizations when applicable
                   - Maintain the original function signature unless instructed otherwise
                
                3. If the user provides conversation history (messages), continue the discussion contextually.
                
                4. For non-coding queries, politely redirect to programming topics.`,
              },
            });
            res.status(201).json({
              message:response.text
            });
            console.log("response",response.text)
        }

        main();
    }
    catch(err){
       res.status.send("ai model");
    } 
}

module.exports = solveQuery;