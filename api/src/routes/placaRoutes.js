const express = require("express");
const router = express.Router();
const auth = require("./auth");
const placaController = require("../controllers/placaController");

// detalhes por id
router.get("/:id", auth, placaController.get);

// cadastro
router.post("/", auth, placaController.post);

// listagem
router.get("/", auth, placaController.list);

// atualizar
router.put("/:id", auth, placaController.put);

// remover
router.delete("/:id", auth, placaController.delete);

// csv metadados por id
router.get("/:id/export-metadados", placaController.exportCsvMetadados);

module.exports = router;
