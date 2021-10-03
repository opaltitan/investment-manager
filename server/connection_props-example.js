const connParams = {
  user: 'user',
  host: 'localhost',
  database: 'ReactTest',
  password: 'p@ssw0rd',
  port: 5432
};

const finAPI = {
  host: 'www.alphavantage.co',
  port: 443,
  apiKey: 'INSERTAPIKEYHERE'
};

module.exports = {
  params: connParams,
  finAPI: finAPI
};
