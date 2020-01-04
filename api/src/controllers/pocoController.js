// const frameModel = require("../models/frameModel")
// const analiseModel = require("../models/analiseModel")

const fs = require("fs")
const path = require('path');
const formidable = require('formidable')

const pocoController = {

    extrair: (req, res, next) => {

        return res.status(201).json("ok");
    }

    /*
    list: (req, res, next) => {
        let search = {}
        
        if(req.params.analiseId){
            search.analiseId = req.params.analiseId
        }

        frameModel.find( search, {
                analiseId: 1,
                url: 1,
                tempoMilis: 1
            }) 
            .then(frames => {
                return res.status(201).json(frames);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });        
    },
    
    get: (req, res, next) => {
        let id = req.params.id;

        frameModel.findById(id)
            .then(frame => {
                return res.status(201).json(frame);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        var form = new formidable.IncomingForm();
        //form.multiples = true;
        form.keepExtensions = true
        form.uploadDir = path.join(__dirname, '../uploads/tmp/')

        form.parse(req, function(err, fields, files) {
            if (err) return res.status(422).send(err.errors);
            let frameFile = files.frame || files.file
            saveFrame(fields, frameFile)
        })


        function saveFrame(fields, file){
            let experimentoCodigo = fields.experimentoCodigo
            let analiseId = fields.analiseId
            let tempoMilis = fields.tempoMilis

            let filename = file.name
            let oldpath = file.path

            if(!experimentoCodigo){
                let errorMsg = 'Código do experimento não informado'
                return res.status(500).json({ error: true, message: errorMsg });
            }

            if(!analiseId){
                let errorMsg = 'ID da análise não informado'
                return res.status(500).json({ error: true, message: errorMsg });
            }

            if(!tempoMilis){
                let errorMsg = 'Tempo em milisegundos não informado'
                return res.status(500).json({ error: true, message: errorMsg });
            }

            if(!file){
                let errorMsg = 'Arquivo do frame não transferido'
                return res.status(500).json({ error: true,message: errorMsg });
            }

            if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                let errorMsg = 'Tipo de arquivo não permitido'
                return res.status(500).json({ error: true, message: errorMsg });
            }

            if(!fs.existsSync(oldpath)){
                console.log("frameController.js: Não existe o oldpath")
            }

            analiseModel.findById(analiseId)
                .then(analise => {
                    let targetpath = path.join(__dirname, `../uploads/experimentos/${experimentoCodigo}/${analise.placa}/${analise.tempo}`)
        
                    if(!fs.existsSync(targetpath)){
                        fs.mkdirSync(targetpath, { recursive: true })
                    }

                    targetpath += '/' + filename
        
                    if(!fs.existsSync(targetpath)){
                        console.log("frameController.js: Não existe o targetpath")
                    }
        
                    fs.rename(oldpath, targetpath, (err) => {
                        if (err) throw err;
        
                        const frame = new frameModel({
                            tempoMilis: tempoMilis,
                            url: targetpath,
                            analiseId: analiseId
                        })
                        
                        frame.save((err, frame) => {
                            if (err) {
                                return res.status(500).json({  message: 'Erro ao criar frame', error: err });
                            }
                            return res.status(201).json(frame);
                        })
                    })

                })
                .catch(err => {
                    return res.status(422).send(err.errors);
                });  
            
            
        }

    },

    
    put: (req, res, next) => {
        var id = req.params.id;

        frameModel.findById(id)
            .populate('frames')
            .exec()
            .then((frame) => {
                if (!frame) {
                    return res.status(404).send()
                }

                frame.analiseId = req.body.analiseId
                frame.tempoMilis = req.body.tempoMilis
                frame.experimentoCodigo = req.body.experimentoCodigo

                frame.save(function (err, frame) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Erro ao atualizar frame.',
                            error: err
                        });
                    }
                    return res.status(201).json(frame);
                })
            })
    },
    
    delete: (req, res, next) => {
        let id = req.params.id;
        frameModel.deleteOne({_id: id},function(err, frame){
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao deletar frame.',
                    error: err
                });
            }
            return res.status(201).json(frame);
        })
    }
    */
}    
module.exports = pocoController