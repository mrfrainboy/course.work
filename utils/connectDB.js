const createConnection = require('mysql').createConnection;
const config = require('../modules/mysql_queries').config;

module.exports = async () => new Promise(
 (resolve, reject) => {
	const connection = createConnection(config);
	connection.connect(error => {
	 if (error) {
		reject(error);
		return;
	 }
	 console.log(`Connected to ${config.database} DB`);
	 resolve(connection);
	})
 });
