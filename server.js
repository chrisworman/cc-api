require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/auth');

mongoose.connect(process.env.CC_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(cors());
app.use(express.json());

const sessionsRouter = require('./routes/sessions');
app.use('/sessions', sessionsRouter);

const reportsRouter = require('./routes/reports');
app.use('/reports', auth, reportsRouter);

const usersRouter = require('./routes/users');
app.use('/users', auth, usersRouter);

const authUsersRouter = require('./routes/authUsers');
app.use('/authUsers', auth, authUsersRouter);

const invitesRouter = require('./routes/invites');
app.use('/invites', auth, invitesRouter);

app.listen(process.env.CC_API_PORT, 'localhost', () => console.log('Server Started'));