const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const UserSchema = schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true}
});

const User = module.exports = mongoose.model("User", UserSchema);

module.exports.addUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    User.create(user);
}

module.exports.getUsers = (callback, limit) => {
    User.find(callback).limit(limit);
}

module.exports.getUserByEmail = (email, callback) => {
    User.findOne({'email': email}, callback);
}

module.exports.verifyUser = (email, password, callback) => {

}