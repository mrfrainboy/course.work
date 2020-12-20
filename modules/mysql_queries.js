const DB_NAME = 'tickets_agency';

const config = {
	host: 'localhost',
	user: 'nodeuser',
	password: 'nodeuserPass',
	database: DB_NAME,
};

const GET_NEW_EVENTS = 'SELECT * FROM newEvents';
const GET_UPCOMING_EVENT = 'SELECT * FROM topDateEvent';


module.exports = { DB_NAME, GET_NEW_EVENTS, config, GET_UPCOMING_EVENT };
