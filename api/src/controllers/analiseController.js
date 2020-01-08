const analiseModel = require("../models/analiseModel")
const moment = require('moment')
const frameModel = require("../models/frameModel")
const fs = require("fs")
var archiver = require('archiver')
var path = require('path')
const d = require("../util/dockerApi")

const analiseController = {

    list: (req, res, next) => {
        let search = {}

        if(req.params.experimentoCodigo){
            search.experimentoCodigo = req.params.experimentoCodigo
        } else {
            if(req.query.experimentoCodigo){
                search.experimentoCodigo = req.query.experimentoCodigo
            }
        }


        analiseModel.find( search, {
                fps: 1,
                tempo: 1,
                experimentoCodigo: 1,
                placa: 1,
                dataColeta: 1
            }) 
            .then(analises => {
                return res.status(201).json(analises);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });        
    },
    
    get: (req, res, next) => {
        let id = req.params.id;

        analiseModel.findById(id)
            .then(analise => {
                let obj = analise.toObject()
                obj.idserver = analise._id

                aux_quadrante = 0
                idPrimeiroFrame = []

                frameQuadrante = []
                frameQuadrante[1] = {qtd: 0, processados: 0, quadrante: 1}
                frameQuadrante[2] = {qtd: 0, processados: 0, quadrante: 2}
                frameQuadrante[3] = {qtd: 0, processados: 0, quadrante: 3}
                frameQuadrante[4] = {qtd: 0, processados: 0, quadrante: 4}

                frameModel.find({'analiseId': obj._id})
                    .then(frames => {
                        let processados = 0;
                        let total = 0;
                        frames.forEach(element => {
                            total++;
                            frameQuadrante[element.quadrante].qtd++;
                            if (element.processado) {
                                processados++;
                                frameQuadrante[element.quadrante].processados++;
                            }

                            if (aux_quadrante != element.quadrante) {
                                aux_quadrante = element.quadrante
                                idPrimeiroFrame.push({
                                    quadrante: aux_quadrante,
                                    idFrame: element._id
                                })
                            }
                        });
                        
                        
                        obj['framesTotal']  = total;
                        obj['framesProcessados']  = processados;
                        obj['idPrimeiroFrame']  = idPrimeiroFrame;
                        obj['frameQuadrante']  = frameQuadrante;
                        
                        return res.status(201).json(obj);
                    })
                    .catch(err => {
                        return res.status(422).send(err.errors);
                    });                    

                // return res.status(201).json(obj);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        var dataColeta = req.body.dataColeta
        if(dataColeta){
            dataColeta = moment(dataColeta, "YYYY-MM-DD").toDate()
        }

        const analise = new analiseModel({
            tempo: req.body.tempo,
            fps: req.body.fps,
            experimentoCodigo: req.body.experimentoCodigo,
            placa: req.body.placa,
            dataColeta: dataColeta
        })

        analise.save((err, analise) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao criar analise',
                    error: err
                });
            }

            let obj = analise.toObject()
            obj.idserver = analise._id
            
            return res.status(201).json(obj);
        })
    },
    
    put: (req, res, next) => {
        var id = req.params.id;

        analiseModel.findById(id)
            .populate('analises')
            .exec()
            .then((analise) => {
                if (!analise) {
                    return res.status(404).send()
                }

                var dataColeta = req.body.dataColeta
                if(dataColeta){
                    dataColeta = moment(dataColeta).toDate()
                }

                analise.placa = req.body.placa
                analise.tempo = req.body.tempo
                analise.fps = req.body.fps
                analise.dataColeta = dataColeta
                analise.experimentoCodigo = req.body.experimentoCodigo

                analise.save(function (err, analise) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Erro ao atualizar analise.',
                            error: err
                        });
                    }
                    return res.status(201).json(analise);
                })
            })
    },
    
    delete: (req, res, next) => {
        let id = req.params.id;
        analiseModel.deleteOne({_id: id},function(err, analise){
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao deletar analise.',
                    error: err
                });
            }
            return res.status(201).json(analise);
        })
    },

    downloadFrames: (req, res, next) => {
        let search = {}
        if(req.params.id){
            search.analiseId = req.params.id
        }

        frameModel.find( search, {
                url: 1
            })
            .then(frames => {                
                let path_zip_folder = '/usr/uploads/tmp/'
                let path_zip_file = path.join(path_zip_folder, `/${search.analiseId}.zip`)

                if (fs.existsSync(path_zip_file)) {
                    fs.unlinkSync(path_zip_file)
                }
                var output = fs.createWriteStream(path_zip_file);

                var archive = archiver('zip', {
                    gzip: true,
                    zlib: { level: 9 } // compression level.
                });
                archive.on('error', (err) => { 
                    console.log("Erro ao criar zip")
                    throw err
                });
                archive.pipe(output);

                // adiciona os frames ao zip
                for(let i=0; i < frames.length; i++) {
                    let frame = frames[i]
                    if (fs.existsSync(frame.url)) {
                        let filename = frame.url.replace("/usr/uploads/experimentos", "")
                        archive.file(frame.url, {name: filename});
                    }
                }

                archive.finalize();
                res.attachment(path_zip_file);
                archive.pipe(res);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });   
    
    },


    downloadPocos: (req, res, next) => {
        let search = {}
        if(req.params.id){
            search.analiseId = req.params.id
        }

        frameModel.find( search, {
                pocos: 1
            })
            .then(frames => {                
                let path_zip_folder = '/usr/uploads/tmp/'
                let path_zip_file = path.join(path_zip_folder, `/${search.analiseId}_pocos.zip`)

                if (fs.existsSync(path_zip_file)) {
                    fs.unlinkSync(path_zip_file)
                }
                var output = fs.createWriteStream(path_zip_file);

                var archive = archiver('zip', {
                    gzip: true,
                    zlib: { level: 9 } // compression level.
                });
                archive.on('error', (err) => { 
                    console.log("Erro ao criar zip")
                    throw err
                });
                archive.pipe(output);

                // adiciona os frames ao zip
                for(let i=0; i < frames.length; i++) {
                    let pocos = frames[i].pocos

                    for(let j=0; j < pocos.length; j++){
                        let poco = pocos[j]

                        if (fs.existsSync(poco.url)) {
                            let filename = poco.url.replace("/usr/uploads/experimentos", "")
                            archive.file(poco.url, {name: filename});
                        }
                    }
                }

                archive.finalize();
                res.attachment(path_zip_file);
                archive.pipe(res);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });   
    
    },

    extractPocos: (req, res, next) => {
        let id = req.params.id;
        let quadrante = req.body.quadrante;
        let pocos = req.body.pocos;

        let raio = req.body.raio;

        // console.log(id)

        // console.log(quadrante)
        
        // console.log(pocos)
        
        // console.log(raio)

        startupParameters = []
        startupParameters.push("python")
        startupParameters.push("process.py")
        startupParameters.push(quadrante)
        startupParameters.push(raio.toString())
        startupParameters.push(id)

        for(let i=0; i < pocos.length; i++) {        
            let poco = pocos[i]
            startupParameters.push(poco.nome)
            startupParameters.push(poco.top.toString())
            startupParameters.push(poco.left.toString())
            //startupParameters += ` ${poco.nome} ${poco.top} ${poco.left}`
        }

        // startupParameters = "echo 'a'"

        console.log(startupParameters)
        // return;

        // return res.status(422).send('ok');

        //   Volumes: { /* Here? */ },

        // docker run -v /usr/uploads:/usr/uploads --network=api_express-mongo-network-sinae frame_processor

        // Cmd: ["python", "/process.py", startupParameters],

        console.log(startupParameters)
        
        d.api()
            .then((api) => {
                api.createContainer({
                    Image: 'frame_processor',
                    Cmd: startupParameters,
                    HostConfig: {
                        NetworkMode: "api_express-mongo-network-sinae",
                        AutoRemove: true,
                        Binds: [
                            `/usr/uploads:/usr/uploads`
                        ]
                    }                    
                }).then(function(container) {
                    container.start()
                        .then((res) => {
                            console.log(res)
                        })
                }).catch(function(err) {
                    /* istanbul ignore next */ 
                    console.log(err)
                    return res.status(422).send(err);
                });
        });

        /*
        analiseModel.findById(id)
            .then(analise => {
                let obj = analise.toObject()
                obj.idserver = analise._id

                aux_quadrante = 0
                idPrimeiroFrame = []

                frameQuadrante = []
                frameQuadrante[1] = {qtd: 0, processados: 0, quadrante: 1}
                frameQuadrante[2] = {qtd: 0, processados: 0, quadrante: 2}
                frameQuadrante[3] = {qtd: 0, processados: 0, quadrante: 3}
                frameQuadrante[4] = {qtd: 0, processados: 0, quadrante: 4}

                frameModel.find({'analiseId': obj._id})
                    .then(frames => {
                        let processados = 0;
                        let total = 0;
                        frames.forEach(element => {
                            total++;
                            frameQuadrante[element.quadrante].qtd++;
                            if (element.processado) {
                                processados++;
                                frameQuadrante[element.quadrante].processados++;
                            }

                            if (aux_quadrante != element.quadrante) {
                                aux_quadrante = element.quadrante
                                idPrimeiroFrame.push({
                                    quadrante: aux_quadrante,
                                    idFrame: element._id
                                })
                            }
                        });
                        
                        
                        obj['framesTotal']  = total;
                        obj['framesProcessados']  = processados;
                        obj['idPrimeiroFrame']  = idPrimeiroFrame;
                        obj['frameQuadrante']  = frameQuadrante;
                        
                        return res.status(201).json(obj);
                    })
                    .catch(err => {
                        return res.status(422).send(err.errors);
                    });                    

                // return res.status(201).json(obj);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    */

            return res.status(201).json('1');
    },
}    
module.exports = analiseController