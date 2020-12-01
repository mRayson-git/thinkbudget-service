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
    // console.log(mostRecent.date + ' | ' + newTrans.date);
    return (Date.parse(mostRecent.date) >= Date.parse(newTrans.date));
}

function updateAll(payee, category) {

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
                // check if a category is already set for this payee
                const potentialCategories = await Transaction.find({'payee': transaction.payee, 'category': { $not: { $regex: 'Uncategorized'} } });
                if (potentialCategories.length > 0) {
                    transaction.category = potentialCategories[0].category;
                    if (potentialCategories.length > 1) {
                        transaction.note = 'Other potential categories were available';
                    }
                }
                transaction = await Transaction.addTransaction(transaction);
                newTransactions.push(transaction);
            }
        }
        // send added transactions back to the client
        res.status(200).send(newTransactions);
    } catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
    
    
});

router.get('/:userEmail', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.getAllTransactions(req.params.userEmail);
        res.status(200).send(transactions);
    } catch (err) {
        res.status(401).send(err);
    }
});

router.put('/:transId', verifyToken, async (req, res) => {
    try {
        const updatedTrans = await Transaction.updateTransaction(req.params.transId, req.body);
        if (updatedTrans) {
            res.status(200).send(updatedTrans);
        } else {
            res.status(401).send('Trans could not be found with that id');
        }
    } catch (err) {
        res.status(401).send(err);
    }
});

router.put('/updateCategories/:userEmail', verifyToken, async (req, res) => {
    updated = []
    try {
        // get all transactions to be set with a category
        const transactions = await Transaction.find({'userEmail': req.params.userEmail, 'payee': req.body.payee });
        // go through the transactions and set they category
        for (let i = 0; i < transactions.length; i++) {
            transactions[i].category = req.body.category;
            const newTrans = await Transaction.updateTransaction(transactions[i]._id, transactions[i]);
            updated.push(newTrans);
        }
        res.status(200).send('Transactions updated!');
    } catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
});

router.put('/updatecategory', verifyToken, async (req, res) => {
    console.log(req.body);
    try {
        const newTrans = await Transaction.updateTransaction(req.body._id, req.body);
        if (newTrans) {
            res.status(200).send(newTrans);
        } else {
            res.status(401).send('Error updating transaction');
        }
    } catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
});

router.get('/:userEmail/:timeframe', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.getAllTransactionsInTimeframe(req.params.userEmail, req.params.timeframe);
        if (transactions) {
            res.status(200).send(transactions);
        } else {
            res.status(200).send('Could not find transactions for timeframe');
        }
    } catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
});
module.exports = router;