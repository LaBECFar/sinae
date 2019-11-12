const deviceModel = require("../models/deviceModel")

const deviceController = {

    list: (req, res, next) => {
        deviceModel.find() 
            .select('name')
            .exec()
            .then(devices => {
                return res.status(201).json(devices);
            })
            .catch(err => {
                /* istanbul ignore next */ 
                return res.status(422).send(err.errors);
            });        
    },
        
    get: (req, res, next) => {
        let id = req.params.id;
        deviceModel.findById(id)
            .then(device => {
                return res.status(201).json(device);
            })
            .catch(err => {
                /* istanbul ignore next */ 
                return res.status(422).send(err.errors);
            });                    
    },
    
    post: (req, res, next) => {
        const device = new deviceModel({
            name: req.body.name,
        })
        
        device.save((err,device) => {
            /* istanbul ignore next */ 
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating device',
                    error: err
                });
            }
            return res.status(201).json(device);
        })
    },
    
    put: (req, res, next) => {
        var id = req.params.id;
        deviceModel.findById(id)
        .populate('devices')
        .exec()
        .then((device) => {
            if (!device) {
                return res.status(404).send()
            }

            device.name = req.body.name

            device.save(function (err, device) {
                /* istanbul ignore next */ 
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating device.',
                        error: err
                    });
                }
                return res.status(201).json(device);
            })
        })
    },
    
    delete: (req, res, next) => {
        let id = req.params.id;
        deviceModel.deleteOne({_id: id},function(err, device){
            /* istanbul ignore next */ 
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting device.',
                    error: err
                });
            }
            return res.status(201).json(device);
        })
    }
}    
module.exports = deviceController