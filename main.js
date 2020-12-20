const express = require('express');
const path = require('path');
const fs = require('fs');

const mysqlQueries = require('./modules/mysql_queries');
const connection = require('./utils/connectDB');
const query = require('./utils/queryDB');

const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'pages'));

app.get('/', (req, res) => {
	res.render('index');
	res.end();
});

app.get('/events', async (req, res) => {
 	const conn = await connection().catch(e => {});
	const response = await query(conn, mysqlQueries.GET_NEW_EVENTS);
	res.status(200).json(response);
	res.end();
});

app.get('/event-template', async (req, res) => {
 	fs.readFile(path.join(__dirname, 'templates/eventElement.html'), 'utf-8', (err, data) => {
 	 	if(err)
 	 	 throw err;
	 res.send(data);
	 res.end();
	});
});

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
