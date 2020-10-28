const express = require('express');
const User = require('../../../../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = require('../../../../config').secret;

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    } 
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, secret);
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.email = payload.subject;
    next(); 
}

// user is registering
router.post('/register', async (req, res) => {
    console.log('Register hit!');
    // make hased password
    try {
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        await User.addUser(user);
        let payload = { subject: user.email }
        let token = jwt.sign(payload, secret);
        res.status(200).send({ token });
    } catch {
        res.status(401).send('Error with creation');
    }
});

// user is logging in
router.post('/login', (req, res) => {
    User.getUserByEmail(req.body.email, (err, user) => {
        if (user) {
            if (!bcrypt.compareSync(req.body.password, user.password)){
                res.status(401).send('Invalid password');
            } else {
                let payload = { subject: req.body.email }
                let token = jwt.sign(payload, secret);
                res.status(200).send({ token });
            }
        } else {
            res.status(401).send('Invalid email');
        }
    });
});

// get all users
router.get('/', verifyToken, (req, res) => {
    User.getUsers((err, users) => {
        if (err) { throw err; }
        res.json(users);
    });
});

module.exports = router;