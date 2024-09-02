const { User, Message } = require('../schemas/schemas'); // Ensure the correct path
const bcrypt = require('bcrypt');
module.exports = {
    findUserByUsername: async (username) => {
        return await User.findOne({ username });
    },
    getUsers: async (req, res) => {
        try {
            const users = await User.find()
            res.status(200).json({ message: 'Users found', users });
        } catch {
            res.status(500).json({ message: 'Error finding users' });
        }
    },
    register: async (req, res) => {
        const { username, password1 } = req.body;
    
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password1, saltRounds);
    
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();
    
            res.json({ message: 'User registered successfully', secretCode: newUser.secretCode });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Error registering user' });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Find the user by username
            const user = await User.findOne({ username });

            // Check if user exists
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }

            // Compare provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);

            // If the password does not match
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password.' });
            }

            // If the password matches, return user details
            res.json({
                message: 'Login successful',
                secretCode: user.secretCode,
                username: user.username,
                profileImage: user.profileImage
            });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Error logging in' });
        }
    },

    getUserProfileByUsername: async (req, res) => {
        const { username } = req.params;

        try {
            const user = await User.findOne({ username }).populate('messages');

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    },

    sendMessage: async (req, res) => {
        const { recipient, message, secretCode } = req.body;

        try {
            const sender = await User.findOne({ secretCode });

            if (!sender) {
                return res.status(401).json({ message: 'Invalid secret code.' });
            }

            const recipientUser = await User.findOne({ username: recipient });

            if (!recipientUser) {
                return res.status(404).json({ message: 'Recipient not found.' });
            }

            const newMessage = new Message({
                sender: sender.username,
                recipient: recipientUser.username,
                content: message
            });

            await newMessage.save();

            recipientUser.messages.push(newMessage._id);
            await recipientUser.save();

            res.json({ message: 'Message sent successfully.' });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Error sending message' });
        }
    },

    getUserMessages: async (req, res) => {
        const { username } = req.params;
        const secretCode = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
    
        try {
            const sender = await User.findOne({ secretCode });
            if (!sender) {
                return res.status(401).json({ message: 'Invalid secret code.' });
            }
    
            const recipientUser = await User.findOne({ username });
            if (!recipientUser) {
                return res.status(404).json({ message: 'Recipient not found.' });
            }
    
            const messages = await Message.find({
                $or: [
                    { sender: sender.username, recipient: recipientUser.username },
                    { sender: recipientUser.username, recipient: sender.username }
                ]
            });
    
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Error fetching messages' });
        }
    },
    getProfile: async (req, res) => {
        const secretCode = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token
    
        try {
            const user = await User.findOne({ secretCode }).populate('messages');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
    
            res.json(user);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ message: 'Error fetching user profile' });
        }
    },
    
    // PUT /profile - Update the user's profile information
    updateProfile: async (req, res) => {
        const { secretCode, newUsername, newPassword, imageUrl } = req.body;
    
        try {
            const user = await User.findOne({ secretCode });
            if (!user) {
                return res.status(401).json({ message: 'Invalid secret code.' });
            }
    
            if (newUsername) {
                const existingUser = await User.findOne({ username: newUsername });
                if (existingUser && existingUser.username !== user.username) {
                    return res.status(400).json({ message: 'Username already exists.' });
                }
                user.username = newUsername;
            }
    
            if (newPassword) {
                const saltRounds = 10;
                user.password = await bcrypt.hash(newPassword, saltRounds);
            }
    
            if (imageUrl) {
                user.profileImage = imageUrl;
            }
    
            await user.save();
    
            res.json({ message: 'Profile updated successfully', user });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    },
};
