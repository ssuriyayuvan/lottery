const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.Promise = global.Promise;
const connectDb = async () => {
  console.log(process.env.database)
  let connectQuery = `mongodb://${process.env.host}:${process.env.port}/${process.env.database}`;
try {
  mongoose.connect(connectQuery, {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }, (err, res) => {
      if (res) return console.log('DB Connected');
      throw err;
  });
} catch (error) {
  console.log('Db not connected', error)
  throw error;
}
}

module.exports = connectDb();