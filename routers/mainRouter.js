const express = require('express');
const Router = express.Router();

const {
    login,
    register,
    getUsers,
    updateUserProfile,
    getUserProfile,
    getUserProfileByUsername,
    sendMessage,
    getUserMessages,
} = require("../controllers/mainController");

const {
    registerValidate,
    loginValidate,
    sendMessageValidate,
} = require("../middleware/validators");

Router.post("/login", loginValidate, login);
Router.post("/register", registerValidate, register);
Router.get("/users", getUsers);
Router.put("/profile", updateUserProfile);
Router.get("/profile", getUserProfile);
Router.get("/users/:username", getUserProfileByUsername);
Router.post("/messages", sendMessageValidate, sendMessage);
Router.get("/messages/:username", getUserMessages);

module.exports = Router;
