const app = require('express')();
require('dotenv').config()
const PORT = 5000;
const db = require('./config/db.config');
const routes = require('./src/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
// db.connect()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/healt-check', (req, res) => {
    res.send('ok')
})

app.use('/api/v1', cors(),(req, res, next) => {
    next()
}, routes);

app.listen(PORT, () => {
    console.log(`App connected on ${PORT}`);
});