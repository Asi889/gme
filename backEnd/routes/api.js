const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../model/userSchema');
const auth = require('../middleware/auth');
const path = require('path');



router.post('/userSignUp', async (req, res) => {
    try {

        let { email, firstName, lastName, password, passwordCheck } = req.body
        // console.log(req.body);

        if (!email || !firstName || !lastName || !password || !passwordCheck) {
            return res.status(400).send('Not all fields have been enterd')
        }
        if (password.length < 5) {
            return res.status(401).send('The password needs to be at least 5 characters long')
        }

        if (password !== passwordCheck) {
            return res.status(400).send('Password most be identical to password Check')
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).send('An account with this email already exists')
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        console.log(passwordHash)

        let newUser = new User({
            email,
            firstName,
            lastName,
            password: passwordHash
        })

        newUser.save();
        res.send(newUser);
    }

    catch (err) {
        res.status(500).send(err)

    }
});


router.post('/logIn', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send('Not all fields have been enterd')
        }

        const user = await User.findOne({ email: email })
        console.log(user);

        if (!user) {
            return res.status(400).send('No account with this email has been registered ')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).send('Invalid credentials ')

        }

        const token = jwt.sign({ id: user._id },  process.env.JWT_SECRET);
        // process.env.JWT_SECRET

        const winni = {
            token,
            user: {
                id: user._id,
                email: user.email
            },

        }

        res.send(winni);

    } catch (err) {
        res.status(500).send(err)

    }
});

router.delete('/deleteUser', auth, async (req, res) => {
    try {

        const deletedUser = await User.findOneAndDelete(req.user)
        res.send(deletedUser)

    } catch (err) {
        res.status(500).send(err)

    }
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header("x-auth-token")
        console.log(token);
        console.log("hohoh");
        console.log(token);

        if (!token) {

            return res.send(false);
        }

        const verified = jwt.verify(token, 'q&*E+Aa2J?uX;*pu}=rXb&#8XjgYhHqT3xP%[:"tv/*55Ha/>^');
        // process.env.JWT_SECRET

        const user = await User.findById(verified.id);

        if (!user) {

            return res.send(false);
        }

        return res.send(true)

    } catch (err) {
        res.status(500).send({ hellyy: "hellyy", error: err })
    }
})

router.get("/test", async (req, res) => {
        res.send("HELLO user")
    })



// router.get("/", auth, async (req, res) => {
//     const user = await User.findById(req.user)
//     console.log(user);
//     res.send(user)
// })
// router.get("/react", (req, res) => {
//     res.sendFile(path.join(__dirname+"../../../build/index.html"));
    
// })

module.exports = router