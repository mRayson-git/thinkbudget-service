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

router.post('/:userEmail', verifyToken, (req, res) => {
    const transactions = req.body;
    let notInDate = 0;
    let inDate = 0;
    try {
        Transaction.getMostRecent(req.params.userEmail, transactions[0].accountName, (err, transaction) => {
            if (err) {
                console.log(err);
            } else {
                // if there is a most recent transaction, accept only transactions that happen after it
                if (transaction !== null) {
                    const mostRecentRead = transaction.date;
                    transactions.forEach(transaction => {
                        if (Date.parse(transaction.date) > Date.parse(mostRecentRead)) {
                            console.log('Transaction in date:');
                            console.log(transaction);
                            inDate++;
                            Transaction.addTransaction(transaction);
                        } else {
                            notInDate++;
                        }
                    });
                // If no most recent transaction, accept all
                } else {
                    transactions.forEach(transaction => {
                        inDate++;
                        Transaction.addTransaction(transaction);
                    });
                }
                console.log(`# of successes: ${inDate}`);
                console.log(`# of anomalies: ${notInDate}`);
                res.status(200).send();
            }
        });
    } catch (e) {
        res.status(401).send();
    }
});

router.get('/:userEmail', verifyToken, (req, res) => {
    
});

module.exports = router;