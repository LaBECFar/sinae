const frameModel = require("../models/frameModel")
const fs = require("fs")
const path = require('path');
const formidable = require('formidable')

const frameController = {

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
            saveFrame(fields, files.frame)
        })


        function saveFrame(fields, file){
            let experimentoCodigo = fields.experimentoCodigo
            let analiseId = fields.analiseId
            let tempoMilis = fields.tempoMilis

            if(!experimentoCodigo){
                return res.status(500).json({ error: true, message: 'Código do experimento não informado' });
            }

            if(!analiseId){
                return res.status(500).json({ error: true, message: 'ID da análise não informado' });
            }

            if(!tempoMilis){
                return res.status(500).json({ error: true, message: 'Tempo em milisegundos não informado' });
            }

            if(!file){
                return res.status(500).json({ error: true,message: 'Arquivo do frame não transferido' });
            }

            if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
                return res.status(500).json({ error: true, message: 'Tipo de arquivo não permitido' });
            }

            
            let filename = file.name
            let oldpath = file.path
            let targetpath = path.join(__dirname, `../uploads/experimentos/${experimentoCodigo}/${analiseId}`)

            if(!fs.existsSync(targetpath)){
                fs.mkdirSync(targetpath, { recursive: true })
            }
            targetpath += '/' + filename

            if(fs.existsSync(oldpath)){
                console.log("Existe o old path")
            }
            if(fs.existsSync(targetpath)){
                console.log("Existe o novo path")
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

                frame.tempo = req.body.tempo
                frame.fps = req.body.fps
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
}    
module.exports = frameController