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

module.exports.addTransaction = (transaction) => {
    Transaction.create(transaction);
}

module.exports.getMostRecent = (userEmail, accountName, callback) => {
    Transaction.findOne({ "userEmail": userEmail, "accountName": accountName }, callback).sort({"date":-1});
}