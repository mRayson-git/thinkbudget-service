const express = require('express');
const Profile = require('../../../../models/parser-profile');
const router = express.Router();
const jwt = require('jsonwebtoken');
const parserProfile = require('../../../../models/parser-profile');
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

// get all of a users parsing profiles
router.get('/:userEmail', verifyToken, (req, res) => {
    try {
        parserProfile.getProfiles(req.params.userEmail, (err, profiles) => {
            if (err) {
                res.status(401).send('Error retreiving parsing profiles, try later...')
            } else {
                res.status(200).send(profiles);
            }
        });
    } catch (e) {
        console.log(e);
        res.status(401).send('Error');
    }
    
});

// add a parsing profile
router.post('/', verifyToken, (req, res)=> {
    try{
        const profile = {
            userEmail: req.body.userEmail,
            header: req.body.header,
            accountName: req.body.accountName,
            dateCol: req.body.dateCol,
            amountCol: req.body.amountCol,
            payeeCol: req.body.payeeCol,
            typeCol: req.body.typeCol
        }
        Profile.addProfile(profile, (err, profile) => {
            if (err) {
                res.status(401).send('Error adding profile.');
            } else {
                res.status(200).send('Profile added successfully!');
            }
        });
    } catch (e) {
        res.status(401).send('Error');
    }
});

module.exports = router;