const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const route = require('../server/routes/threadroute');
// Middleware
app.use(cors());
app.use(bodyParser.json());
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



// Routes (we'll add them later)

