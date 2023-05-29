const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

dotenv.config({path: './config.env'});

require('./db/conn');
// const User = require('./model/userSchema')

app.use(express.json());

app.use(require("./router/auth"));

const PORT = process.env.PORT;

// const middleware = (req, res, next) => {
//     // app.use(express.json());
//     console.log("Hello Middleware!");
//     next();
// }

// middleware();

// app.get('/', (req, res) => {
//     res.send('Hello world!')
// });

// app.get('/about', (req, res) => {
//     res.send('Hello about world!')
// });

// app.get('/contact', (req, res) => {
//     res.cookie("jwtoken", "token")
//     res.send('Hello contact world!')
// });

// app.get('/signin', (req, res) => {
//     res.send('Hello login world!')
// });

app.get('/signup', (req, res) => {
    res.send('Hello registration world!')
});

app.listen(PORT, () => {
    console.log(`Server is running at port no: ${PORT}`);
})