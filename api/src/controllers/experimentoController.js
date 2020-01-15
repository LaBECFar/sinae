const experimentoModel = require("../models/experimentoModel")

const experimentoController = {

    list: (req, res, next) => {
        let filtros = {}
        if(req.user){
            filtros.createdBy = req.user.userid
        }

        experimentoModel.find(filtros) 
            .then(experimentos => {
                return res.status(201).json(experimentos);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });        
    },
    
    get: (req, res, next) => {
        let id = req.params.id;

        experimentoModel.findById(id)
            .then(experimento => {
                return res.status(201).json(experimento);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },

    getByCodigo: (req, res, next) => {
        let codigo = req.params.codigo;

        experimentoModel.findOne({ codigo: codigo })
            .then(experimento => {
                return res.status(201).json(experimento);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        const experimento = new experimentoModel({
            codigo: req.body.codigo,
            label: req.body.label
        })

        if(req.user){
            experimento.createdBy = req.user._id
        }
        
        experimento.save((err, experimento) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao criar experimento',
                    error: err,
                    success: false
                });
            }
            return res.status(201).json(experimento);
        })
    },
    
    put: (req, res, next) => {
        var id = req.params.id;

        experimentoModel.findById(id)
            .populate('experimentos')
            .exec()
            .then((experimento) => {
                if (!experimento) {
                    return res.status(404).send()
                }

                experimento.label = req.body.label
                experimento.codigo = req.body.codigo

                experimento.save(function (err, experimento) {
                    /* istanbul ignore next */ 
                    if (err) {
                        return res.status(500).json({
                            message: 'Erro ao atualizar experimento.',
                            error: err,
                            success: false
                        });
                    }
                    return res.status(201).json(experimento);
                })
            })
    },
    
    delete: (req, res, next) => {
        let id = req.params.id;
        experimentoModel.deleteOne({_id: id},function(err, experimento){
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao deletar experimento.',
                    error: err,
                    success: false
                });
            }
            return res.status(201).json(experimento);
        })
    }
}    
module.exports = experimentoController