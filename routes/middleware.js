const { Router } = require("express");
const {validationResult} = require('express-validator');

//Middleware function that handles return errors - saves a few lines of code!
function checkErrors(req, res, next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()});
    }
    else next();
}

module.exports = checkErrors;