const { v4: uuidv4 } = require('uuid');

const users = [];

const findUserByUsername = (username) => users.find(user => user.username === username);
const findUserBySecretCode = (secretCode) => users.find(user => user.secretCode === secretCode);
const sanitizeUser = (user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
};

module.exports = {
    findUserByUsername,
    findUserBySecretCode,

    register: (req, res) => {
        const { username, password1 } = req.body;
        const newUser = {
            id: uuidv4(),
            username,
            password: password1,
            profileImage: 'https://cdn-icons-png.freepik.com/512/4645/4645949.png',
            secretCode: uuidv4()
        };
        users.push(newUser);
        res.json({ message: 'User registered successfully', secretCode: newUser.secretCode });
    },

    login: (req, res) => {
        const { username, password } = req.body;
        const user = findUserByUsername(username);

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        res.json({ message: 'Login successful', secretCode: user.secretCode, username: user.username, profileImage: user.profileImage, });
    },

    getUsers: (req, res) => {
        const sanitizedUsers = users.map(user => sanitizeUser(user));
        res.json(sanitizedUsers);
    },

    updateUserProfile: (req, res) => {
        const { secretCode, imageUrl, newUsername, newPassword } = req.body;
        const user = findUserBySecretCode(secretCode);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (imageUrl) {
            user.profileImage = imageUrl;
        }
        if (newUsername) {
            user.username = newUsername;
        }
        if (newPassword) {
            user.password = newPassword;
        }
        res.json({ message: 'Profile updated successfully.', user });
    },

    getUserProfile: (req, res) => {
        const { secretCode } = req.query;
        const user = findUserBySecretCode(secretCode);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(sanitizeUser(user));
    },

    getUserProfileByUsername: (req, res) => {
        const { username } = req.params;
        const user = findUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(sanitizeUser(user));
    },

    sendMessage: (req, res) => {
        const { recipient, message, secretCode } = req.body;

        const sender = findUserBySecretCode(secretCode);
        const recipientUser = findUserByUsername(recipient);

        if (!sender) {
            return res.status(401).json({ message: 'Invalid secret code.' });
        }

        if (!recipientUser) {
            return res.status(404).json({ message: 'Recipient not found.' });
        }

        const newMessage = {
            sender: sender.username,
            content: message,
            timestamp: new Date().toISOString()
        };

        recipientUser.messages = recipientUser.messages || [];
        recipientUser.messages.push(newMessage);
        res.json({ message: 'Message sent successfully.' });
    },

    getUserMessages: (req, res) => {
        const { username } = req.params;
        const user = findUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user.messages || []);
    },
};
