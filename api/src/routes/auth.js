let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //get the token from the header if present
    let token = req.headers["x-access-token"] || req.headers["authorization"]

    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).send("Acesso negado. Nenhum token informado.")

    if (token.indexOf('Bearer ') == 0) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
    }

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = decoded
        req.teste = decoded
        next();
    } catch (ex) {
        //if invalid token
        res.status(400).send("Token inválido.");
    }
}
