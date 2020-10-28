const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// database
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/thinkbudget', (err) => {
    if (err){console.log(err);}
    console.log("Connected to db");
});

// routes
app.use('/api/v1/users', require('./routes/api/v1/user/users'));

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});