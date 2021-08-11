require('dotenv').config();

const express = require('express');
const cors = require('cors');
const router = require('./app/router');

const port = process.env.PORT || 3001;

const app = express();

app.use(cors('*'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});