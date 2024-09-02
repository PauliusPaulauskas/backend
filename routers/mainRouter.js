const express = require('express');
const Router = express.Router();

const {
    login,
    register,
    getUsers,
    getUserProfileByUsername,
    sendMessage,
    getUserMessages,
    updateProfile,
} = require("../controllers/mainController");

const {
    registerValidate,
    loginValidate,
    sendMessageValidate,
} = require("../middleware/validators");

Router.post("/login", login);
Router.post("/register", registerValidate ,register);
Router.get("/users", getUsers);
Router.get("/users/:username", getUserProfileByUsername);
Router.post("/messages", sendMessageValidate, sendMessage);
Router.get("/messages/:username", getUserMessages);
Router.put('/profile', updateProfile)

module.exports = Router;
