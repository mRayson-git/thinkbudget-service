const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

app.use(cors());

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/thinkbudget', (err) => {
    if (err){console.log(err);}
    console.log("Connected to db");
});

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});