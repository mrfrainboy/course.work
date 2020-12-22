var byLabel;

function getEventElement(event, html) {
 	let doc = document.createElement('div');
 	doc.innerHTML = html;

 	/**/

	let img = byLabel(doc, 'event_img');
	img.setAttribute('src', event.artist_img);

	let artist_name = byLabel(doc, 'event_artist_name');
	artist_name.innerHTML = event.artist_name;

	let place = byLabel(doc, 'event_place');
	place.innerHTML = `${ event.place_city }: ${ event.place_name }`;

	let date = byLabel(doc, 'event_date');
	date.innerHTML = beautifyDateTime(event.date);

	let a_description = byLabel(doc, 'artist_description');
	a_description.innerHTML = event.artist_description;

	let e_description = byLabel(doc, 'event_description');
	e_description.innerHTML = event.description;

	/* */

	let buybtn = byLabel(doc, 'buy_button');
	buybtn.setAttribute('href', `/order?id=${event.event_id}`);

	return doc;
}

byLabel = (doc, aria) => doc.querySelector(`[aria-label="${aria}"]`);

function beautifyDateTime(dateTime) {
 	return `${new Date(dateTime).toLocaleDateString()} ${new Date(dateTime).toLocaleTimeString()}`
}
