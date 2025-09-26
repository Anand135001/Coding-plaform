const axios = require('axios');

const getlanguageById = (lang) => {
    
    const language = {
        "c++":54,
        "java":62,
        "javascript":63,
        "python":71,
    }

    return language[lang.toLowerCase()];
}

const submitBatch = async(submissions) =>{
    
    const options = {
            method: "POST",
            url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
            params: {
            base64_encoded: "false",
        },
        headers: {
            "x-rapidapi-key": process.env.JUDGE0_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        data: {
            submissions
        },
    };

async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

return await fetchData();

}

const submitToken = async(resultToken) => {

    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: resultToken.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": process.env.JUDGE0_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    async function fetchData() {
      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }

    while(true){
        const result = await fetchData();
        // === Is output under process === 
        const IsrResultObtained = result.submissions.every((el) => el.status_id > 2);
        
        if(IsrResultObtained){
            return result.submissions;
        }
        // === waiting for 1 sec before hitting API again ===
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}



module.exports = {getlanguageById, submitBatch, submitToken};