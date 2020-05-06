const mongoose = require('mongoose')
const enviromentPreparations = require("../util/enviromentPreparations")


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to Database")
    enviromentPreparations.check()
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});



module.exports = mongoose
