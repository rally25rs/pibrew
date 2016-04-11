'use strict';

function update() {
	$.ajax({
		url: '/api/update',
		type: 'GET'
	}).done(function(response) {
		console.log(response);
	}).fail(function(jqXHR) {
		console.error('unable to get data');
	});
}