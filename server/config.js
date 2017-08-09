
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
  // test: {
  //   username: 'taiwo',
  //   password: null,
  //   database: 'database_test',
  //   host: 'localhost',
  //   dialect: 'postgres'
  // },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
