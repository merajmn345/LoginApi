const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const userFetch = require("../middleware/fetchuser");

const { body, validationResult } = require("express-validator");

const JWT_SECRET = "meraj@123@##bobby";

//Route 1 Create a User using : POST "/api/auth/"...
router.post(
    "/createuser",
    [
        // express vaidator use for validaating email

        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password must have a minimum of 5 characters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        let success = false;

        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            // find user in database
            let user = await User.findOne({ email: req.body.email });

            const salt = await bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hashSync(req.body.password, salt);

            //       create a new User in database
            user = await User.create({
                email: req.body.email,
                password: hashPassword,
            });
            //       res.json(user);

            const data = {
                user: {
                    id: user.id,
                },
            };

            var authToken = jwt.sign(data, JWT_SECRET);
            console.log(authToken);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            // catch errors for any error
            console.error(error.message);
            res.status(500).send("Some Error occured");
        }
    }
);

//Route 2 Authentication a User using : POST "/api/auth/login", No login required

router.post(
    "/login",
    [
        // express vaidator use for validaating email

        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password must have a minimum of 5 characters").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        const { email, password } = req.body;
        console.log("req body", req.body);
        const errors = validationResult(req);

        let success = false;

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id,
                },
            };

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error occured");
        }
    }
);

//Route 3 Get user details after loggedin a User using : POST "/api/auth/getuser",  login required

router.post("/getuser", userFetch, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
});

module.exports = router;
