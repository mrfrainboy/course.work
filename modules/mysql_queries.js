const DB_NAME = 'tickets_agency';

const config = {
	host: 'localhost',
	user: 'nodeuser',
	password: 'nodeuserPass',
	database: DB_NAME,
};

const GET_NEW_EVENTS = () => 'SELECT * FROM new_events';
const GET_UPCOMING_EVENT = () =>'SELECT * FROM top_date_event';
const GET_EVENT = (id) => `${ GET_NEW_EVENTS() } WHERE event_id = ${ id }`;
const GET_EVENT_SEATS = (id) => `SELECT * FROM event_seats WHERE event_id = ${ id }`;

const INSERT_TICKET = (ticketData) => {
 let now = new Date();
 let query = `INSERT INTO tickets(date_bought, visitor_id, event_seats_id) VALUES('${ now.getFullYear()}-${ now.getUTCDay()<10 ? '0' + now.getDay() : now.getDay() }-${ now.getMonth() }', (SELECT v.visitor_id FROM visitor v WHERE v.email = '${ ticketData.email }'), ${ ticketData.event_seats_id });`;
 return query;
};

const CREATE_VISITOR = (visitorData) => {
 let now = new Date();
 let query =
	 `INSERT IGNORE INTO visitor SET email = '${ visitorData.email }', fio = '${ visitorData.fname } ${ visitorData.lname }', age = ${new Date(now - new Date( visitorData.birthday )).getFullYear() - 1969 };`;
 return query;
};

module.exports = { DB_NAME, config, GET_NEW_EVENTS, GET_UPCOMING_EVENT, GET_EVENT, GET_EVENT_SEATS, INSERT_TICKET, CREATE_VISITOR};
