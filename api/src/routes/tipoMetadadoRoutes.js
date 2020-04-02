const express = require("express");
const router = express.Router();
const auth = require("./auth");
const tipoMetadadoController = require("../controllers/tipoMetadadoController");

// detalhes por id
router.get("/:id", auth, tipoMetadadoController.get);

// cadastro
router.post("/", auth, tipoMetadadoController.post);

// listagem
router.get("/", auth, tipoMetadadoController.list);

// atualizar
router.put("/:id", auth, tipoMetadadoController.put);

// remover
router.delete("/:id", auth, tipoMetadadoController.delete);

module.exports = router;
