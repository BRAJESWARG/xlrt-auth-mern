const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate')

require('../db/conn');
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    res.send('Hello world!')
});

//Using Promises 

// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Please fill the field properly!" })
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email already Exist" });
//             }
//             const newUser = new User({
//                 name: name,
//                 email: email,
//                 phone: phone,
//                 work: work,
//                 password: password,
//                 cpassword: cpassword
//             });
//             newUser.save()
//                 .then(() => {
//                     res.status(201).json({ message: 'User registrered Successfully!' });
//                 })
//                 .catch((err) => {
//                     res.status(500).json({ error: "Failed to registrered!" });
//                 });
//         })
//         .catch((err) => {
//             res.status(500).json({ error: err });
//         });

//     // res.json({message: req.body})
// });

//Using async await
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill the field properly!" })
    }

    try {

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
        }
        else if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        }
        else {
            const newUser = new User({ name, email, phone, work, password, cpassword });
            await newUser.save();
            res.status(201).json({ message: 'User registrered Successfully!' });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to registrered!" });
    }

});

router.post('/signin', async (req, res) => {

    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the field properly!" });
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);
            // token = await userLogin.generateAuthToken();

            // res.cookie("jwtoken", token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true
            // });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credintials! pass" });
            }
            else {

                token = await userLogin.generateAuthToken();

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });

                res.json({ message: "User SignIn Successfull!" });
                // return res.json({ message: "User SignIn Successfully!" });

            }
        }
        else {
            return res.status(400).json({ error: "Invalid Credintials!" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to SignIn!" });
    }

});

router.get('/about', authenticate, (req, res) => {
    console.log('Hello about world!');
    res.send(req.rootUser);
});

router.get('/getData', authenticate, (req, res) => {
    console.log('Hello getData world!');
    res.send(req.rootUser);
})

router.post('/contact', authenticate, async (req, res) => {

    try {
        const { name, email, phone, message, subject } = req.body;
        if (!name || !email || !phone || !message || !subject) {
            console.log("Error in contact form!");
            return res.status(400).json({ error: "Please fill the field properly!" });
        }
        const userContact = await User.findOne({ _id: req.userID });
        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message, subject);
            await userContact.save();
            res.status(201).json({ message: "Message Sent Successfully!" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to SignIn!" });

    }
    // res.cookie("jwtoken", "token")
    // res.send('Hello contact world!')

});

router.get('/signout', (req, res) => {
    console.log(`Hello my Logout Page`);
    res.clearCookie('jwtoken', { path: '/' });
    console.log('Hello Sign Out world!');
    res.status(200).send("Sign Out!");
});

module.exports = router;

// {
//     "name": "Brajeswar",
//     "email": "test1@gmail.com",
//     "phone": 9876543201,
//     "work" : "Web Developer",
//     "password": "webdeveloper",
//     "cpassword": "webdeveloper"
// }