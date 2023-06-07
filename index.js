const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => {
    console.log(`DB connection error: ${error.message}`);
  });

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const { createServer } = require('serverless-http');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', coursesRoutes);

module.exports = createServer(app);
