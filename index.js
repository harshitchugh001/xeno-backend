const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();

// connect to db
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"));



mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

// import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

app.get('/', (req, res) => {
    res.send('Hello from Node API');
});

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors()); // allows all origins


// middleware
app.use('/api', authRoutes);
app.use('/api', contactRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});

module.exports = app
