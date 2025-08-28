const getlanguageById = (lang) => {
    
    const language = {
        "c":110,
        "c++":104,
        "java":91,
        "javascript":102,
        "python":71
    }

    return language[lang.toLowerCase()];
}

module.exports = getlanguageById;