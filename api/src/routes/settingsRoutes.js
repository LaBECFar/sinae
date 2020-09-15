const express = require("express")
const router = express.Router()
const auth = require("./auth")
const settingsController = require("../controllers/settingsController")

// get settings
router.get("/", auth, settingsController.get)

// change settings
router.put("/", auth, settingsController.put)

// upload model.pkl file 
router.post("/upload-model-pkl", auth, settingsController.uploadModel)

module.exports = router
