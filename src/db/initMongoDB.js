const mongoose = require('mongoose');
const getEnvVar = require('../utils/getEnvVar');

const initMongoDB = () => {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  mongoose
    .connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    )
    .then(() => {
      console.log('MongoDB connection successfully established!');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
};
module.exports = initMongoDB;
