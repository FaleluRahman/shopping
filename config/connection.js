const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
};

const url = 'mongodb://localhost:27017';
const dbname = 'shopping';

module.exports.connect = function (done) {
    console.log("Connecting to MongoDB...")
    if (state.db) {
        return done();
    }

    MongoClient.connect(url, (err, client) => {
        if (err) {
            
            console.error("MongoDB Connection Error", err);
            return done(err);
        }
        state.db = client.db(dbname);
        console.log("MongoDB Connected successfully.");
        done();
    });
};

module.exports.get = function () {
    return state.db;
};
