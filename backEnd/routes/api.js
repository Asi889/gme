const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../model/userSchema');
const Gig = require('../model/gig');
const Review = require('../model/review')
const auth = require('../middleware/auth');
const path = require('path');
// require('dotenv').config()




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
        // console.log(passwordHash)

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
        // console.log(user);

        if (!user) {
            return res.status(400).send('No account with this email has been registered ')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).send('Invalid credentials ')

        }
        // console.log("bbb");
        // console.log(process.env.JWT_SECRET);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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

        if (!token) {

            return res.send(false);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // 'q&*E+Aa2J?uX;*pu}=rXb&#8XjgYhHqT3xP%[:"tv/*55Ha/>^'
        process.env.JWT_SECRET

        const user = await User.findById(verified.id);

        if (!user) {

            return res.send(false);
        }

        return res.send(true)

    } catch (err) {
        res.status(500).send({ hellyy: "hellyy321", error: err })
    }
})

router.get("/test", (req, res) => {
    // console.log("shack");
    res.send("Moti Levi Ha Gever!!!!!!!!!!!!!!!!!!!!!")
})



router.get("/profile", auth, async (req, res) => {
    // console.log(req.user);
    const user = await User.findById(req.user)
    // console.log(user);
    res.send(user)
})


router.get("/api/test", (req, res) => {
    res.json("HELLO user")
})

router.post('/newGig', auth, async (req, res) => {

    try {

        const newGig = new Gig({
            ...req.body,
            gigMakerID: req.user,
            gigTakerID: null
        });
        await newGig.save();
        res.send(newGig);

    } catch (error) {
        console.log(error);
    }

})

router.get('/getReviews', auth, async (req, res) => {
    try {

        let user = req.user
        // console.log(user);
        const reviews = await Review.find({})
        // console.log(reviews);
        res.send(reviews)

    } catch (error) {
        console.log(error);
    }


})

router.post('/newReview', auth, async (req, res) => {
    try {

        // console.log(req.body);
        const newReview = new Review({ ...req.body })
        await newReview.save()
        res.end()
    } catch (error) {
        console.log(error);
    }
})

router.get("/applyToGig/:id", auth, async (req, res) => {

    try {

        const _id = req.params.id;
        let gig = await Gig.findOne({ _id });

        gig.gigTakerID = req.user;
        gig.status = 'on process';
        gig = await gig.save();
        // console.log(gig);
        // console.log("222222222222");
        res.end()

    } catch (error) {
        console.log(error);

    }

})

router.get("/finishGig/:id", auth, async (req, res) => {

    try {
        console.log(req.params.id);
        const _id = req.params.id;
        let gig = await Gig.findOne({ _id });
        gig.status = "completed!";
        console.log(gig);
        gig = await gig.save();
        res.end();
    } catch (error) {
        console.log(error);
    }

})

router.get("/feed", auth, async (req, res) => {
    const gigs = await Gig.find({})

    res.send(gigs)
    // res.json("HELLO user")
});

router.get("/allUsers", auth, async (req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers)
    // res.json("HELLO user")
});

router.put("/updateGig", auth, async (req, res) => {

    try {

        let _id = req.body.gigId
        let gig = await Gig.findOne({ _id });

        gig.category = req.body.category;
        gig.description = req.body.description;
        gig.created = Date.now()
        gig.dueDate = req.body.dueDate;
        gig.expirationDate = req.body.expirationDate;
        gig.location = req.body.location;
        gig.status = req.body.status;
        gig.cost = req.body.cost;

        gig = await gig.save();
        res.end();

    } catch (error) {
        console.log(error);
    }
})


router.put("/updateProfile", auth, async (req, res) => {
    try {

        let picture = req.body
        console.log("bonee");
        console.log(picture);
        console.log("bonee");

        let _id = req.user
        // console.log("shick");
        // console.log(_id);
        // console.log("shack");
        // console.log(picture);
        // console.log("shuck");
        let user = await User.findByIdAndUpdate({ _id: _id }, {picture: picture.pic});
        // user.picture = picture
        user = await user.save();
        res.send(user.picture);
        // res.end()

    } catch (error) {
        console.log(error);
    }
})
// console.log(__dirname);


// router.get('/hell', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });



module.exports = router