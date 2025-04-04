const startServer = require('./server');
const initMongoDB = require('./db/initMongoDB');
const connection = () => {
  initMongoDB();
  startServer();
};
connection();
