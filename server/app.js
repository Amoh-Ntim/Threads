const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const route = require('../server/routes/threadroute');
const path = require('path');
const corsOptions = {
  origin: 'http://192.168.109.69:8081', // replace with the origin of your frontend app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Accept'],
};

// Middleware
// app.use(express.static(path.join(__dirname, 'Images'), { index: false }))
// Remove trailing slash
app.use(express.static('Images'));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(route);
const port = 6000;
const uri = 'mongodb+srv://amohntim:threadss@threadscluster.za8dfkw.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error(err));


