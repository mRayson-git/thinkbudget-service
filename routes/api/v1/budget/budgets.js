const express = require('express');
const Budget = require('../../../../models/budget');
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

// updating or creating budget
router.put('', verifyToken, async(req, res) => {
    try {
        const budget = {
            userEmail: req.body.userEmail,
            budgetCategories: req.body.budgetCategories,
            categories: req.body.categories
        }
        console.log(budget);
        const currentBudget = await Budget.getBudget(budget.userEmail);
        // If there is a current budget, update it
        if (currentBudget) {
            console.log('Current budget already exists, updating...');
            const newBudget = await Budget.updateBudget(budget.userEmail, budget);
            res.status(200).send(newBudget);
        } 
        // No current budget, add it
        else {
            console.log('No current budget, adding fresh one...');
            const newBudget = await Budget.addBudget(budget);
            console.log(newBudget);
            res.status(200).send(newBudget);
        }
    } catch (err) {
        res.status(401).send(err);
    }
    
});

// getting budget
router.get('/:userEmail', verifyToken, async (req, res) => {
    try {
        const budget = await Budget.getBudget(req.params.userEmail);
        if (budget) {
            res.status(200).send(budget);
        } else {
            res.status(401).send('No budget found');
        }
    } catch (err) {
        res.status(401).send(err);
    }
});
module.exports = router;