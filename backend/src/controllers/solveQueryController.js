const { GoogleGenAI } = require("@google/genai");

const solveQuery = async(req, res) => {
    
    try{
        const ai = new GoogleGenAI({apikey: process.env.GEMINI_API_KEY});
        
        async function main() {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: "Why is the sky blue?",
              config: {
                systemInstruction: "You are a coding instructor. Answer only programming and computer science questions. Explain clearly with concise examples. If the question is not coding-related, politely refuse.",
              },
            });
            res.status(201).send(response.text)
        }

        main();
    }
    catch(err){
       res.status.send("ai model");
    } 
}

module.exports = solveQuery;