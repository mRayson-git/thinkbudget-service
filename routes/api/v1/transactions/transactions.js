const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = require('../../../../config').secret;
const Transaction = require('../../../../models/transaction');

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

function isTransDup(mostRecent, newTrans) {
    // if there is no most recent
    if (!mostRecent) {
        return false;
    }
    return (Date.parse(mostRecent.date) >= Date.parse(newTrans.date));
}

// adding transactions to the database add send them back to the client
router.post('/:userEmail', verifyToken, async (req, res) => {
    try {
        // array of transactions to be added
        newTransactions = [];
        // all the transactions to add
        transactions = req.body;
        // most recent transaction in the database
        mostRecent = await Transaction.getMostRecent(req.params.userEmail, transactions[0].accountName);
        // for each of the transactions, check if in date & add to database
        for (let transaction of transactions) {
            if (!isTransDup(mostRecent, transaction)) {
                transaction = await Transaction.addTransaction(transaction);
                newTransactions.push(transaction);
            }
        }
        // send added transactions back to the client
        console.log(newTransactions);
        res.status(200).send(newTransactions);
    } catch (err) {
        res.status(401).send(err);
    }
    
    
});

router.get('/:userEmail', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.getAllTransactions(req.params.userEmail);
        console.log(transactions);
        res.status(200).send(transactions);
    } catch (err) {
        res.status(401).send(err);
    }
});

module.exports = router;