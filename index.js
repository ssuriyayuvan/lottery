const app = require('express')();
require('dotenv').config()
const PORT = 5000;
require('./config/db.config');
const routes = require('./src/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/api/v1', (req, res, next) => {
    next()
}, routes);

app.listen(PORT, () => {
    console.log(`App connected on ${PORT}`);
})