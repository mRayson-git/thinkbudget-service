const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TransactionSchema = schema({
    userEmail: { type: String, required: true },
    accountName: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    payee: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: false },
    note: { type: String, required: false },
    category: { type: String, required: true }
});

const Transaction = module.exports = mongoose.model('Transaction', TransactionSchema);

module.exports.addTransaction = async (transaction) => {
    try {
        const trans = await Transaction.create(transaction);
        return trans;
    } catch (err) {
        throw err;
    }
    
}

module.exports.addManyTransactions = async (transactions) => {
    try {
        let newTransactions = [];
        transactions.forEach(transaction => {
            const trans = Transaction.create(transaction);
            newTransactions.push(trans);
        });
        return newTransactions;
    } catch(err) {
        throw err;
    }
}

module.exports.getAllTransactions = async (userEmail) => {
    try{
        const allTransactions = await Transaction.find({ 'userEmail': userEmail }).sort({ 'date': -1 }).exec();
        return allTransactions;
    } catch (err) {
        throw err;
    }
}

module.exports.getAllTransactionsInTimeframe = async(userEmail, timeframe) => {
    try {
        const allTransactions = await Transaction.find({ 'userEmail': userEmail, 'date': { '$regex': timeframe } }).sort({ 'date': -1 }).exec();
        return allTransactions;
    } catch (err) {
        throw err;
    }
}

module.exports.getMostRecent = async (userEmail, accountName) => {
    try {
        const mostRecent = await Transaction.findOne({ "userEmail": userEmail, "accountName": accountName }).sort({"date":-1}).exec();
        return mostRecent;
    } catch(err) {
        throw err;
    }
}

module.exports.updateTransaction = async (transId, transaction) => {
    try {
        const trans = await Transaction.replaceOne({ '_id': transId }, transaction).exec();
        return trans;
    } catch (err) {
        throw err;
    }
}

module.exports.setCategory = async (transId, Transaction) => {
    try {
        changedTransactions = [];
        const transactions = await Transaction.find({ 'userEmail': userEmail, 'payee': payee });
        transactions.forEach(transaction => {
            transaction.category = category;
            changedTransaction = Transaction.replaceOne({ '_id': transaction._id }, transaction);
            changedTransactions.push(changedTransaction);
        });
        return changedTransactions;
    } catch (err) {
        console.log(err);
        throw err;
    }
}