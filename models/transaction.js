const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TransactionSchema = schema({
    userEmail: { type: String, required: true },
    accountName: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    payee: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: false },
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

module.exports.getMostRecent = async (userEmail, accountName) => {
    try {
        const mostRecent = await Transaction.findOne({ "userEmail": userEmail, "accountName": accountName }).sort({"date":-1}).exec();
        return mostRecent;
    } catch(err) {
        throw err;
    }
}