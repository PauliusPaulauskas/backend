const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: 'https://cdn-icons-png.freepik.com/512/4645/4645949.png' },
    secretCode: { type: String, default: uuidv4 },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Message };
