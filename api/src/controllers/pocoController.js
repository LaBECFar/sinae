// const frameModel = require("../models/frameModel")
// const analiseModel = require("../models/analiseModel")

const fs = require("fs")
const path = require('path');
const formidable = require('formidable')

const pocoController = {

    extrair: (req, res, next) => {

        return res.status(201).json("ok");
    }

}    
module.exports = pocoController