var upcomingEvent = null;
var eventTemplate;

$(document).ready(() => {
	$.get('/event-template', (data) => { eventTemplate = data; });

	$.getJSON( '/events',(data) => {
		$.each( data, function( key, val ) {
		 	if(!upcomingEvent)
		 	 	upcomingEvent = val;
			$('.events-content').append(getEventElement(val, eventTemplate));
		});
		byLabel(document, 'upcoming_img').setAttribute('src', upcomingEvent.artist_img);
		byLabel(document, 'upcoming_date').innerText = beautifyDateTime(upcomingEvent.date);
		byLabel(document, 'upcoming_artist').innerText = upcomingEvent.artist_name;
		byLabel(document, 'upcoming_place').innerText = upcomingEvent.place_city;
		byLabel(document, 'upcoming_buy').setAttribute('href', `/order/?id=${upcomingEvent.event_id}`);
	});

});
