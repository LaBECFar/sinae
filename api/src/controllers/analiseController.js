const analiseModel = require("../models/analiseModel")

const analiseController = {

    list: (req, res, next) => {
        let search = {}
        
        if(req.params.codigoExperimento){
            search.codigoExperimento = req.params.codigoExperimento
        }

        analiseModel.find( search, {
                fps: 1,
                tempo: 1,
                codigoExperimento: 1
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
                return res.status(201).json(analise);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        const analise = new analiseModel({
            tempo: req.body.tempo,
            fps: req.body.fps,
            codigoExperimento: req.body.codigoExperimento
        })
        
        analise.save((err, analise) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao criar analise',
                    error: err
                });
            }
            return res.status(201).json(analise);
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

                analise.tempo = req.body.tempo
                analise.fps = req.body.fps
                analise.codigoExperimento = req.body.codigoExperimento

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
    }
}    
module.exports = analiseController