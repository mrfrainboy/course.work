const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const mysqlQueries = require('./modules/mysql_queries');
const connection = require('./utils/connectDB');
const query = require('./utils/queryDB');

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
	refresh_token: '1//045fSXLWA3GS1CgYIARAAGAQSNwF-L9IrHhR5n8R848izOijVZclGYwMylkUjbX2rXwH7TSGyw05bw97GaKYRMPu3cmshamRe8Sk',
 };
 let accessToken = await oAuth2Client.getAccessToken();
 const smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	 type: 'OAuth2',
	 user: 'proevent.coursework@gmail.com',
	 clientId: '756458656528-1qhv9d3qc7nukh5mc7t09qgeabe52jm6.apps.googleusercontent.com',
	 clientSecret: 'HMg7iNljTztjfaKSDvIlV0cz',
	 refreshToken: '1//045fSXLWA3GS1CgYIARAAGAQSNwF-L9IrHhR5n8R848izOijVZclGYwMylkUjbX2rXwH7TSGyw05bw97GaKYRMPu3cmshamRe8Sk',
	 accessToken,
	},
 });
 const mailOptions = {
	from: 'proevent.coursework@gmail.com',
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
const proEventMail = {
 	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
 	auth: {
	 type: 'OAuth2',
	 user: 'noreply@proevent-299315.iam.gserviceaccount.com',
	 accessToken: '\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5rywHnaxHV1Mm\\nhd5qq7vbXxvAsFUj0RwUZHCm9+cQvszj9k2qldJUkPfOe91K6NuPO5YYuB0gCSVG\\ngd9RSAsVXoENXXHavXr23uD27nTyQcc4g/qAXZeEBJeJQUvEdQOOye1lGOZ8NWFr\\nQpBJJ4+HwEkoyVnfna5NrFYNBYa97xdPgFYwKvp56+YRQMGX6WWuF2AzHp0aMgUK\\nL13gVajgZv+utX+tnmIZr9UoS94W+qg+Dyu4VXCkLGgBzErwZ2zBd2NCAn+dVtPm\\npdq6ffaZmf4QQhGoIOb+kA3PeOTQcERRLz8NI3o8R8h44fWXVFh9C0OA8mumOrCn\\nv4btzHRVAgMBAAECggEAVG4d16KurMu8r9YMEbXf1/pxjJbBR+Vz3qPjA1DSnK8d\\nTAR5QTkZp8E5JIb20vJ5rzG5aKkC+UefTuWLzRI0k/ViOdkFBaDFsk4avb0kqOkW\\n9JAyTb8Av5M08kCh+oT4ZqtTifYeC1lcYCCmqdTWszPQMD8J4h95G7FieU5Le73e\\nbUE6VPjAlK4/4EkopM3Eagy5dXpX7DHyAq6kwlR84kr9PRUxKk/UVp8YhJ1v9sNj\\nVfQl8omI8ubN7J+vF/ilGa78w8zm9AymEl05hxx2Nr9zOee04lzVvYcHNEPF3Mnn\\nytpH77WD8kuwQo82fXQvpB1f0MesvA1S5H4y8qBDSwKBgQDmAGNp/mkbERR6/e1E\\nzuM/VvkInpMrgqJXKMoUIe5mzVCp7GEq8yNwBN1c4tkOYh6OTBeJCCrQQ31VFiqW\\nuFNqjRKUjLMQj/Y41Vis6nKMRTb5JvkTOV3fKvXooFjS1X5tNm89PcD4S41TAjrh\\nVGHLuBVqu98+U89vDF5WTf9jiwKBgQDOrF09pm6M8pDFkfQVX9taY5C5OsO1rXxo\\njVER+z/fOhyfhvjkqX8TlNVdGwPOKagUR+wU8HA3SIZHJx4LawlTTYREaFlAN0YI\\nk/ojLcHBZ1Yp0YCRuYio6+T7R7q4RDv+sVdGV8a2iNba5qIfMjPcN+Q7Zhzknuxi\\nYMBVPmkDnwKBgCUC1vyNdfhnDTalefLin+rnYfejHOeZg+ompC4NL8HXNC3D3fb9\\nXSx/e+egkXEhFO2tDPR+HfWZhqeUg5HxY2r3/I9u/LmjkOmgWz6oE3rDAI+jV91i\\nE9r/nMasVt7GgCuu4MOoFk9eSQWcjEEKRRp1Ku0cAlaTQgQKp3uX3Yr1AoGBAI7Y\\ngYWn8AcJbNixfYP8gg8ifBgarsR2iWN2MU99WfM/JiN41bSuFkABgctdba7kCeEi\\nqOD8IoODZBPvzItVytdB36asfOuuiIBLTvtbl+zGML6sp/GQzAz9JoIrXLoZp2Ht\\nTwY2iwkE4YPhHrLzLvcJxnzrohK+aWHBv43rmge/AoGBAIvzlDz5mcVCzta3bg1H\\nV563SabtuYLZ5GI6Q0YFG8NFeHOVwYC+UlpriCu+dH+n3nCGPl8Wnl5tqRLqh5Gp\\nUaKW2iCj2Z7/fmtyUsiY1H1Pi75VMfY7upNHhAnl17BnB4IfDPrXBdQNWIdmh5Hw\\nND5NmAEJRq2gV37PrJckNhmh\\n'
	},
};

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
	 html: `<h2>Вітаємо, ${ form.fname } ${ form.lname }!</h2><br><h3>Ви щойно придбали квиток на ${ data.event.artist_name }, ${ data.event.place_name } в місті ${ data.event.place_city }, що відбудеться <em>${ new Date(data.event.date).toLocaleDateString() } о ${ new Date(data.event.date).toLocaleTimeString() }</em>.</h3>
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

/*
* 756458656528-1qhv9d3qc7nukh5mc7t09qgeabe52jm6.apps.googleusercontent.com
* HMg7iNljTztjfaKSDvIlV0cz
* 1//045fSXLWA3GS1CgYIARAAGAQSNwF-L9IrHhR5n8R848izOijVZclGYwMylkUjbX2rXwH7TSGyw05bw97GaKYRMPu3cmshamRe8Sk
* */
