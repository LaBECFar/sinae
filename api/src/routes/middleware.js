let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {
        if (token.indexOf('Bearer ') == 0) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token inválido'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Token não informado'
        });
    }
};

module.exports = {
    checkToken: checkToken
}