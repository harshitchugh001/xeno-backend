const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((error) => {
    console.log(`DB connection error: ${error.message}`);
  });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Node API');
});

app.use(bodyParser.json());

app.use(cors());



app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));


module.exports = app;
