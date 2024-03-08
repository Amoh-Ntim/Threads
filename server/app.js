import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import route from './routes/threadroute.js';
const app = express();
const corsOptions = {
  origin: 'http://192.168.27.69:8081', // replace with the origin of your frontend app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Accept'],
};

// Middleware
app.use(express.static('Images'));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(route);
app.use(express.json());
const port = 6000;
const uri = 'mongodb+srv://amohntim:threadss@threadscluster.za8dfkw.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error(err));


