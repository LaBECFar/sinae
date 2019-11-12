var mongoose = require('mongoose');
// var locationModel = require('./locationModel')

var Schema   = mongoose.Schema;

var devicesSchema = new Schema({
	'name' : String,
  'description' : String 
  //'connectionType': {
//    type: String,
    //required: true
  //},
  // 'location': {
  //   type: Schema.Types.ObjectId,
  //   ref: 'location',
  //   required: true        
  // },
  //'dockerId' : { // define which container docker is access this device, if null it means that the device is stopped 
//    type: String,
  //  default: ""
  //}
},{
  timestamps: true
});

module.exports = mongoose.model('device', devicesSchema);
