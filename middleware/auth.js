const User = require('../models/user');
const Session = require('../models/session');

module.exports = function (req, res, next) {
    console.log('Authenticating request: ' + req.method + ' ' + req.originalUrl);
    const headerSessionId = req.headers['x-session'];
    if (!headerSessionId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        Session.findById(headerSessionId, function(err, session) {
            if (err || !session || !session.userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            User.findById(session.userId, function(err, user) {
                if (err || !user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                req.user = user;
                next();
            });
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};