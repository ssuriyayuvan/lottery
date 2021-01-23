const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;


// const connectDb = async () => {
//     console.log(process.env.database)
//     let connectQuery = `mongodb://${process.env.host}:${process.env.port}/${process.env.database}`;
    console.log(`mongodb://${process.env.db_user_name}:${process.env.db_password}@${process.env.host}:${process.env.port}/${process.env.database}`)
//     try {
        exports.connect = () => {
            mongoose.Promise = global.Promise;
            mongoose.connect(`mongodb://${process.env.db_user_name}:${process.env.db_password}@${process.env.host}:${process.env.port}/${process.env.database}`,
            // mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CONNECTION}`,
              {
                keepAlive: 1,
                useNewUrlParser: true,
                autoIndex: false,
                useFindAndModify: false,
                useCreateIndex: true,
                useUnifiedTopology: true
              });
            return mongoose.connection;
          };
        // mongoose.connect(connectQuery, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }, (err, res) => {
        //     if (res) return console.log('DB Connected');
        //     throw err;
        // });
//     } catch (error) {
//         console.log('Db not connected', error)
//         throw error;
//     }
// }

// module.exports = connectDb();