const { findUserByUsername } = require('../controllers/mainController');

const isPasswordValid = (password) => {
    const lengthValid = password.length >= 4 && password.length <= 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*_+]/.test(password);
    return lengthValid && hasUpperCase && hasSpecialChar;
};

module.exports = {
    registerValidate: (req, res, next) => {
        const { username, password1, password2 } = req.body;

        if (!username || !password1 || !password2) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (username.length < 4 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 4 and 20 characters.' });
        }

        if (!isPasswordValid(password1)) {
            return res.status(400).json({ message: 'Password must be 4-20 characters long, include an uppercase letter, and a special symbol (!@#$%^&*_+).' });
        }

        if (password1 !== password2) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        if (findUserByUsername(username)) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        next();
    },

    loginValidate: (req, res, next) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        if (username.length < 4 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 4 and 20 characters.' });
        }

        if (!isPasswordValid(password)) {
            return res.status(400).json({ message: 'Password must be 4-20 characters long, include an uppercase letter, and a special symbol (!@#$%^&*_+).' });
        }

        next();
    },

    sendMessageValidate: (req, res, next) => {
        const { recipient, message, secretCode } = req.body;

        console.log("Validating message:", { recipient, message, secretCode });

        if (!recipient || !message || !secretCode) {
            return res.status(400).json({ message: 'Recipient, message, and secret code are required.' });
        }

        if (message.length > 100 || message.length < 3) {
            console.log("Message length validation failed:", message.length);
            return res.status(400).json({ message: 'Message must be between 3 and 100 characters.' });
        }

        next();
    },
};
