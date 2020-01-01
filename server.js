require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/auth');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(auth);
app.use(express.json());

const reportsRouter = require('./routes/reports');
app.use('/reports', reportsRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.listen(process.env.PORT, () => console.log('Server Started'));