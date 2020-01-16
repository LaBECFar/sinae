let jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // pega o token do cabeçalho da requisição caso exista
    let token = req.headers["x-access-token"] || req.headers["authorization"]

    // Se nenhum token for encontrado já retorna na resposta
    if (!token) return res.status(401).send("Acesso negado. Nenhum token informado.")

    // Remove 'Bearer' do token caso encontre
    if (token.indexOf('Bearer ') == 0) {
        token = token.slice(7, token.length)
    }

    try {
        // se o token for verificado corretamente seta o user da requisição e continua para o próximo método apontado na rota
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = decoded
        next();
    } catch (ex) {
        res.status(400).send("Token inválido.");
    }
}
