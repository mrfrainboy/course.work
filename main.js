const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const mysqlQueries = require('./modules/mysql_queries');
const connection = require('./utils/connectDB');
const query = require('./utils/queryDB');

dotenv.config();
const app = express();
const Oauth2 = google.auth;
const Mailing = {};
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new Oauth2.OAuth2(
	'756458656528-1qhv9d3qc7nukh5mc7t09qgeabe52jm6.apps.googleusercontent.com',
	'HMg7iNljTztjfaKSDvIlV0cz',
	OAUTH_PLAYGROUND,
);
Mailing.sendEmail = async data => {
 oAuth2Client.credentials = {
  ...oAuth2Client.credentials,
	refresh_token: process.env.REFRESH_TOKEN,
 };
 let accessToken = await oAuth2Client.getAccessToken();
 const smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	 type: 'OAuth2',
	 user: process.env.MY_EMAIL,
	 clientId: process.env.CLIENT_ID,
	 clientSecret: process.env.CLIENT_SECRET,
	 refreshToken: process.env.REFRESH_TOKEN,
	 accessToken,
	},
 });
 const mailOptions = {
	from: process.env.MY_EMAIL,
	to: data.email,
	subject: 'Ви придбали квиток!',
	text: data.text,
	html: data.html,
 };
 smtpTransport.sendMail(mailOptions, (err, info) => {
	if (err){
	 console.log(err);
	 return err;
	}
	return info;
 });
};

const hostname = '127.0.0.1';
const port = 3000;

app.use(favicon(path.join(__dirname,'favicon.png')));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'pages'));

app.get('/', (req, res) => {
	res.render('index');
	res.end();
});

app.get('/events', async (req, res) => {
 	const conn = await connection().catch(e => {});
	const response = await query(conn, mysqlQueries.GET_NEW_EVENTS());
	res.status(200).json(response);
	res.end();
});

app.get('/order', (req, res) => {
 	res.render('order');
 	res.end();
});

app.get('/event', async (req, res) => {
 let id = req.query.id;

 const conn = await connection().catch(e => {});
 const response = await query(conn, mysqlQueries.GET_EVENT_SEATS(id));
 res.status(200).json({ response });
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

app.post('/buy', async (req, res) => {
 	const data = req.body;
 	const form = QueryStringToJSON(data.form);
 	const conn = await connection().catch(e => {});
 	await query(conn, mysqlQueries.CREATE_VISITOR(form)).catch(e => console.log(e));
 	const response = query(conn, mysqlQueries.INSERT_TICKET(form)).catch(e => console.log(e));
 	Mailing.sendEmail({
	 email: form.email,
	 html: `
		<h2>Вітаємо, ${ form.fname } ${ form.lname }!</h2>
		<br>
		<h3>Ви щойно придбали квиток на ${ data.event.artist_name }, ${ data.event.place_name } в місті ${ data.event.place_city }, що відбудеться <em>${ new Date(data.event.date).toLocaleDateString() } о ${ new Date(data.event.date).toLocaleTimeString() }</em>.</h3>
		<h4>Ваше місце: <em>${ data.seat_type.seat_type }</em>, ${ data.seat_type.price }₴.</h4>`
 	});
	res.sendStatus(202);
 	res.end();
});

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});


function QueryStringToJSON(str) {
 var pairs = str.split('&');

 var result = {};
 pairs.forEach(function(pair) {
	pair = pair.split('=');
	result[pair[0]] = decodeURIComponent(pair[1] || '');
 });

 return JSON.parse(JSON.stringify(result));
}

