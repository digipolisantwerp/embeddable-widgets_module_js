/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const express = require('express');

const app = express();
const port = 3000;

app.use('/', express.static('dist'));

app.listen(port, () => console.log(`Framework app listening on port ${port}!`));
