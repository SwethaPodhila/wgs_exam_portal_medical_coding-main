const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

function authenticateUser(req, res, next) {
    const token = req.cookies['token'];
    if (!token) return redirectToLogin(res); // No token, redirect to login

    jwt.verify(token, "medi_coding_token", async (err, decoded) => {
        if (err) return redirectToLogin(res); // Token expired or invalid, redirect to login
        try {
            const user = await User.findByPk(decoded.id);
            if (!user) return redirectToLogin(res); // User not found, redirect to login
            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    });
}

function redirectToLogin(res) {
    // Redirect to your login page
    res.redirect('/login'); // Adjust the path as per your application
}

module.exports = authenticateUser;
