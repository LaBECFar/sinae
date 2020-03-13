const frameModel = require("../models/frameModel")
const analiseModel = require("../models/analiseModel")

const fs = require("fs")
const formidable = require('formidable')
const Jimp = require("jimp") 
var path = require('path')
const crypto = require('crypto')

const { exec } = require("child_process");

const frameController = {

    list: (req, res, next) => {
        let search = {}
        
        if(req.params.analiseId){
            search.analiseId = req.params.analiseId
        }

        frameModel.find( search, {
                analiseId: 1,
                url: 1,
                tempoMilis: 1,
                quadrante: 1,
                processado: 'false'
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
    
    getImage: (req, res, next) => {
        let id = req.params.id;
                
        frameModel.findById(id)
            .then(async (frame) => {
                base64 = "";                
                if (fs.existsSync(frame['url'])) {
                    var bitmap = "";     
                    if (path.extname(frame['url']) == '.tif'){                        
                        return await Jimp.read(frame['url'], function (err, file) {
                            if (err) {
                                console.log(err)
                            } else {
                              let hash = crypto.createHash('md5').update(frame['url']).digest("hex")
                              aux_name = `/usr/uploads/tmp/${hash}_aux.png`
                              file.write(aux_name)
                              setTimeout(() => {                                  
                                  bitmap = fs.readFileSync(aux_name)                                  
                                  base64 = "data:image/png;base64,".concat(new Buffer(bitmap).toString('base64'))                                 
                                  return res.json(base64);
                              }, 500);
                            }
                          })
                    } else {
                        bitmap = fs.readFileSync(frame['url'])
                        base64 = "data:image/png;base64,".concat(new Buffer(bitmap).toString('base64'))                
                        return res.json(base64);
                    }
                } else {
                    console.log("Imagem não localizada")
                    return res.status(404).json({ msg: "Imagem não localizada"});
                }
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        var form = new formidable.IncomingForm();
        //form.multiples = true;
        form.keepExtensions = true
        form.uploadDir = '/usr/uploads/tmp/'

        form.parse(req, function(err, fields, files) {
            if (err) return res.status(422).send(err.errors);
            let frameFile = files.frame || files.file
            saveFrame(fields, frameFile)
        })



        function saveFrame(fields, file){
            let experimentoCodigo = fields.experimentoCodigo
            let analiseId = fields.analiseId
            let tempoMilis = fields.tempoMilis
            let quadrante = fields.quadrante

            let filename = file.name
            let oldpath = file.path

            if(!experimentoCodigo){
                let errorMsg = 'Código do experimento não informado'
                return res.status(500).json({ error: true, message: errorMsg, success: false });
            }

            if(!analiseId){
                let errorMsg = 'ID da análise não informado'
                return res.status(500).json({ error: true, message: errorMsg, success: false });
            }

            if(!tempoMilis){
                let errorMsg = 'Tempo em milisegundos não informado'
                return res.status(500).json({ error: true, message: errorMsg, success: false });
            }

            if(!quadrante){
                let errorMsg = 'Quadrante não informado'
                return res.status(500).json({ error: true, message: errorMsg, success: false });
            }

            if(!file){
                let errorMsg = 'Arquivo do frame não transferido'
                return res.status(500).json({ error: true,message: errorMsg, success: false });
            }

            let permitedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/x-ms-bmp', 'image/tiff']

            if(permitedTypes.indexOf(file.type) <= -1){
                let errorMsg = 'Tipo de arquivo não permitido'
                console.log("Tentativa de upload não permitido: " + file.type)
                return res.status(415).json({ error: true, message: errorMsg, success: false });
            }

            if(!fs.existsSync(oldpath)){
                console.log("frameController.js: Não existe o oldpath")
            }

            analiseModel.findById(analiseId)
                .then(analise => {
                    let targetpath = `/usr/uploads/experimentos/${experimentoCodigo}/${analise.placa}/${analise.tempo}`
        
                    if(!fs.existsSync(targetpath)){
                        fs.mkdirSync(targetpath, { recursive: true })
                    }

                    targetpath += '/' + filename
        
                    if(fs.existsSync(targetpath)){
                        console.log("frameController.js: diretório de destino já existe")
                    }
        
                    fs.rename(oldpath, targetpath, (err) => {
                        if (err) throw err;

                        // se for tif então temos que remover o alfa
                        // usando o convert Q1_1000.tif -alpha off Q1_1000.tif 
                        exec(`convert ${targetpath} -alpha off ${targetpath}`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });

                        const frame = new frameModel({
                            tempoMilis: tempoMilis,
                            url: targetpath,
                            analiseId: analiseId,
                            quadrante: quadrante
                        })
                        
                        frame.save((err, frame) => {
                            if (err) {
                                return res.status(500).json({  message: 'Erro ao criar frame', error: err, success: false });
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
                frame.quadrante = req.body.quadrante

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
        
        frameModel.findOneAndDelete({_id: id},function(err, frame){
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao deletar frame.',
                    error: err
                });
            }

            frame.removerArquivos()

            return res.status(201).json(frame);
        })
    }
}    
module.exports = frameController