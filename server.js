// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mainRouter = require('./routers/mainRouter');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://pauliusPaulauskas:paulius123@cluster0.mkrw3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use('/', mainRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
