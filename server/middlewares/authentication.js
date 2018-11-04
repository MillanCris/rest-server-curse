const jwt = require('jsonwebtoken');

//=============
//Verififc token
//=============

let tokenValidation = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'invalid token'
                }
            });
        }

        req.user = decode.user;
        next();

    });
};

let roleValidation = (req, res, next) => {

    let user = req.user;
    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'you don\'t have enough permission'
            }
        });
    }
    next();
};


module.exports = {
    tokenValidation,
    roleValidation
}