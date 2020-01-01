const User = require('../models/user');

module.exports = function (req, res, next) {
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
};