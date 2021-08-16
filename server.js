require('dotenv').config();
const express = require('express');
const cors = require('cors');

const router = require('./app/router');

const port = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors({origin: 'http://dev.pokertool.fr'}));

app.use(router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

