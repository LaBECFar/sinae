const mongoose = require('mongoose')

mongoose.set('useUnifiedTopology', true);

//console.log("aaaa")
console.log(process.env.MONGODB_URL)
//console.log("aaaa")

/* istanbul ignore next */ 
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}).then(() => {
    // console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


module.exports = mongoose
