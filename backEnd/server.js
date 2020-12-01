const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const api = require('./routes/api');
require('dotenv').config();



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    
    next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', api)

// app.get('/', (req,res)=>{
    //     res.render()
    // })
    
    const port = 3001
    
    app.listen(port, () => {
        console.log(`running on port ${port}`);
    });

    mongoose.connect('mongodb+srv://asi:Asi123321@gig.jr1wz.mongodb.net/gig', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    // process.env.MONGODB_CONNECTION_STRING