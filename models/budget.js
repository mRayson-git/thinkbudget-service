const mongoose = require('mongoose');
const schema = mongoose.Schema;

const BudgetSchema = schema ({
    userEmail: { type: String, required: true },
    budgetCategories: { type: [], required: true },
    categories: { type: [], required: false }
});

const Budget = module.exports = mongoose.model("Budget", BudgetSchema);
// GET request
module.exports.getBudget = async(userEmail) => {
    try {
        const budget = await Budget.findOne({ 'userEmail': userEmail });
        return budget;
    } catch (err) {
        throw err;
    }
}

// POST request
module.exports.addBudget = async (budget) => {
    try {
        const newbudget = Budget.create(budget);
        return newbudget;
    } catch (err) {
        throw err;
    }  
}

// PUT request
module.exports.updateBudget = async (userEmail, budget) => {
    try {
        const newbudget = await Budget.updateOne({"userEmail": userEmail}, budget).exec();
        return newbudget;
    } catch (err) {
        throw err;
    }
}