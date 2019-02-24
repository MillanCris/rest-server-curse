const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'user not found'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'user not found2'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: 60 * 60 })

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    console.log('---estoy aquii----');

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let google_user = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            });
        });
    console.log(google_user);

    User.findOne({ email: google_user.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (userDB) {
            console.log(userDB);
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar autentication nomal'
                    }
                });
            } else {

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES })

                return res.json({
                    ok: true,
                    user: userDB,
                    token

                });
            }
        } else {
            // if user dosen't exist on our db
            let user = new User();
            user.name = google_user.name;
            user.email = google_user.email;
            user.img = google_user.img;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }


                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES })

                return res.json({
                    ok: true,
                    user: userDB,
                    token

                });
            });

        }
    });
});


module.exports = app;