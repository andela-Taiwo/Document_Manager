
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  development: {
    username: 'taiwo',
    password: null,
    database: 'docmanagerapi',
    host: 'localhost',
    dialect: 'postgres',
    jwtSecret: null,
    jwtSession: { session: false }
  },

  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres',
  },

  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
