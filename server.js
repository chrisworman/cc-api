require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(express.json());

// TODO: refactor auth
const User = require('./models/user');
app.use(function (req, res, next) {
    // TODO: refactor
    console.log('**** Auth middleware');
    const headerSessionId = req.headers['x-session'];
    if (!headerSessionId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        User.findOne({ sessionId: headerSessionId }, function(err, user) {
            if (err || !user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
// TODO: end auth

const reportsRouter = require('./routes/reports');
app.use('/reports', reportsRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.listen(process.env.PORT, () => console.log('Server Started'));