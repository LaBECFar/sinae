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

// upload cellprofiler config .cpproj file 
router.post("/upload-cellprofiler-config", auth, settingsController.uploadCellprofilerConfig)

// check if the needed config files exist
router.get("/check-config-files", auth, settingsController.checkConfigFilesExist)

module.exports = router
