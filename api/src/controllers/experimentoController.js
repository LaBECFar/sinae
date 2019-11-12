const experimentoModel = require("../models/experimentoModel")

const experimentoController = {

    list: (req, res, next) => {
        experimentoModel.find() 
            .select('codigo, label')
            .exec()
            .then(experimentos => {
                return res.status(201).json(experimentos);
            })
            .catch(err => {
                /* istanbul ignore next */ 
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
                /* istanbul ignore next */ 
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        const experimento = new experimentoModel({
            codigo: req.body.codigo,
            label: req.body.label
        })
        
        experimento.save((err, experimento) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating experimento',
                    error: err
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
                            message: 'Error when updating experimento.',
                            error: err
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
                    message: 'Error when deleting experimento.',
                    error: err
                });
            }
            return res.status(201).json(experimento);
        })
    }
}    
module.exports = experimentoController