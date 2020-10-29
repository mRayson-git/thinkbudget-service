const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ParserSchema = schema({
    userEmail: { type: String, required: true },
    header: { type: Boolean, required: true },
    accountName: { type: String, required: true },
    dateCol: { type: String, required: true },
    amountCol: { type: String, required: true },
    payeeCol: { type: String, required: true },
    typeCol: { type: String, required: true }
});

const Parser = module.exports = mongoose.model('Parser', ParserSchema);

module.exports.addProfile = (parser) => {
    Parser.create(parser);
}

module.exports.getProfiles = (userEmail, callback) => {
    Parser.find({ 'userEmail': userEmail }, callback);
}