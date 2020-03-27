const express = require("express");
const router = express.Router();
const auth = require("./auth");
const metadadoController = require("../controllers/metadadoController");

// detalhes por id
router.get("/:id", auth, metadadoController.get);

// cadastro
router.post("/", auth, metadadoController.post);

// listagem
router.get("/", auth, metadadoController.list);

// atualizar
router.put("/:id", auth, metadadoController.put);

// remover
router.delete("/:id", auth, metadadoController.delete);

module.exports = router;
