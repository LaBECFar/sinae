const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/connect");

const router = express.Router();

//Rotas
const index = require("./routes/index");
const experimentoRoutes = require("./routes/experimentoRoutes");
const analiseRoutes = require("./routes/analiseRoutes");
const frameRoutes = require("./routes/frameRoutes");
const userRoutes = require("./routes/userRoutes");
const tipoMetadadoRoutes = require("./routes/tipoMetadadoRoutes");
const placaRoutes = require("./routes/placaRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

const cors = require("cors");

var corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use("/experimento", experimentoRoutes);
app.use("/analise", analiseRoutes);
app.use("/frame", frameRoutes);
app.use("/user", userRoutes);
app.use("/tipo-metadado", tipoMetadadoRoutes);
app.use("/placa", placaRoutes);
app.use("/settings", settingsRoutes);
app.use("/", index);

module.exports = app;
