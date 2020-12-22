var event_id;
var event;
var seats;

let searchParams = new URLSearchParams(window.location.search);

$(document).ready(() => {
	if(!searchParams.has('id')) {
	 	window.location.href = '/';
	}
	event_id = searchParams.get('id');
	$.get(`/event?id=${ event_id }`, (data) => {
	 	console.log(data);
	 	event = data.response[0];
	 	seats = data.response;
		byLabel(document, 'upcoming_date').innerText = beautifyDateTime(event.date);
		byLabel(document, 'upcoming_artist').innerText = event.artist_name;
		byLabel(document, 'upcoming_place').innerText = event.place_city;

		seats.forEach(seat_type => {
		 	$('#event_seats').append(`
    			<div class="card">
					 <div class="card-body">
						 <h5 class="card-title">${ seat_type.seat_type }</h5>
						 <p class="card-text">${ seat_type.price }₴</p>
						 <p class="card-text">${ seat_type.available } залишилось</p>
						 <div class="form-check">
						 	<input required type="radio" href="#" class="form-check-input stretched-link" name="event_seats_id" value="${ seat_type.event_seats_id }">Обрати</input>
						 </div>
					 </div>
				 	</div>
		 	`);
		});
	});

 var form = $('form');
 form.submit((eSubmit) => {
	 eSubmit.stopPropagation();
	 eSubmit.preventDefault();
	 if(document.querySelector('form').checkValidity()) {
	  let event_seats_id = $('input[type="radio"]:checked').val();
		form.addClass('was-validated');
		$.ajax({
		 	url: '/buy',
		 	type: 'POST',
		 	data: { form: form.serialize(), event, seat_type: seats.find(seat => seat.event_seats_id == event_seats_id) },
		}).done(() => null
			// $('#bought').addClass('show').addClass('showing')
		).fail((err) => console.log(JSON.stringify(err)));

		$('#bought').addClass('show').addClass('showing');

		setTimeout(() => window.location.href = '/', 3000);
	 }
 });
});
