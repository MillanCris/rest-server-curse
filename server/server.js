require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.json('Hello World');
})
app.post('/user', function(req, res) {
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: "The name is required"
        });
    } else {
        res.json({
            person: body
        })
    }

    res.json({
        body
    });
})


app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    console.log(req.param);
    res.json({
        id
    });
})

app.patch('/user', function(req, res) {
    res.json('Hello World');
})

app.delete('/user', function(req, res) {
    res.json('Hello World');
})


app.listen(process.env.PORT, () => {
    console.log('list in port:', process.env.PORT);
});