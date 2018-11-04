const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const User = require('../models/UserModel');
const { tokenValidation, roleValidation } = require('../middlewares/authentication');

app.get('/user', [tokenValidation, roleValidation], function(req, res) {
    let offset = Number(req.query.offset) || 0;
    let limit = Number(req.query.limit) || 5;
    console.log('object');
    User.find({ status: true }, 'name email status')
        .skip(offset)
        .limit(limit)
        .exec((err, user_list) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ status: true }, (err, total) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    user: user_list,
                    cout: total
                });
            });
        })
});


app.post('/user', [tokenValidation, roleValidation], function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            user: userDB
        });
    });
})

app.put('/user/:id', [tokenValidation, roleValidation], function(req, res) {
    console.log('entre');
    let user_id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(user_id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            user: userDB
        })
    })
});

app.delete('/user/:id', [tokenValidation, roleValidation], function(req, res) {
    let user_id = req.params.id;

    User.findByIdAndUpdate(user_id, { status: false }, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            user: userDB
        })
    })

});


// app.delete('/user/:id', function(req, res) {
//     let user_id = req.params.id
//     User.findByIdAndDelete(user_id, (err, user_deleted) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             })
//         }
//         if (!user_deleted) {
//             return res.status(400).json({
//                 ok: false,
//                 err: 'user not found'
//             })
//         }
//         return res.json({
//             ok: true,
//             user: user_deleted
//         })
//     })
// });


module.exports = app;