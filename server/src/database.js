import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DB_STRING);

const _dbConnections = {};

async function getDBConnection(dbName) {
    if (!_dbConnections[dbName]) {
        await client.connect();
        _dbConnections[dbName] = client.db(dbName);
        console.log("✅ MongoDB connected:", dbName);
    } else {
        console.log("✅ Already connected:", dbName);
    }
    return _dbConnections[dbName];
}

export default getDBConnection;
