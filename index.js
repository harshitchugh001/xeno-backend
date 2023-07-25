const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();

mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((error) => {
    console.log(`DB connection error: ${error.message}`);
    process.exit(1);
  });

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

app.get('/', (req, res) => {
  res.send('Hello from Node API');
});

app.use(bodyParser.json());

app.use(cors());

app.use('/api', authRoutes);
app.use('/api', contactRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

module.exports = app;
