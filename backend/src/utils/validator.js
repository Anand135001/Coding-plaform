const vaildator = require('validator');

const validate = (data) => {
   
    const mandatoryField = ['firstname','emailID','password'];

    const IsAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));
    
    if(!IsAllowed){
        throw new Error('Some Fields Missing');
    }
}

module.exports = validate;