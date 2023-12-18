const express = require('express');
const app = express();
const payments = require('./routes/stripe');
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173"
};

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/api/payments', payments);

app.listen(4242, () => console.log('Running on port 4242'));