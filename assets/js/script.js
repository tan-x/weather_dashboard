// use default city of Austin if no city in localstorage, use localstorage city if exists
if (localStorage.getItem('recentCity') === null) {
	getData('Austin');
	newListCity('Austin');
} else {
	var recentCity = JSON.parse(localStorage.getItem('recentCity'));
	getData(recentCity);
}

// take user input, make all lower case, seperate by spaces, and make the first letter of each word in string toUpperCase
// prevents user inputing incorrect casing
function newCity() {
	var newCity = $('input').val();
	// newCity = newCity
	// 	.toLowerCase()
	// 	.split(' ')
	// 	.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
	// 	.join(' ');
	getData(newCity);
	$('input').val('');
}

function getData(city) {
	var queryURL =
		'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=18bbe1392a0905c921468fb3545d2bfb';
	$.ajax({
		url: queryURL,
        method: 'GET',
        // if AJAX return is successfull, make new list item, print weather, and run additional functions for images and forecast
		success: function (response) {
			$('#error-message').text('');
			newListCity(response.name);
			localStorage.setItem('recentCity', JSON.stringify(city));
			var m = moment
				.unix(response.dt)
				.utcOffset(response.timezone / 60)
				.format('MM/DD/YYYY');
			var tempF = (response.main.temp - 273.15) * 1.8 + 32;
			var lat = response.coord.lat;
			var lon = response.coord.lon;
			var dayTime = response.dt > response.sys.sunrise && response.dt < response.sys.sunset;
			console.log(dayTime);
			console.log(response);
			$('#city').text(response.name + ' ' + m);
			$('.temp').html(tempF.toFixed(0) + '&deg;');
			$('.humid').html(response.main.humidity + '%');
			$('.wind').html((response.wind.speed * 2.237).toFixed(0) + ' MPH');
			conditionImg(response.weather[0].main, dayTime, 'current');
			getForecast(lat, lon);
			animate();
        },
        // if AJAX return is an error, show error message and animate its disappearance
		error: function (xhr, ajaxOptions, thrownError) {
			if (xhr.status == 404) {
				console.log(thrownError);
				var error = $('#error-message');
				error.css({ opacity: 1, fontSize: '16px' });
				error.text('Invalid City!');
				setTimeout(() => {
					error.animate(
						{
							fontSize: '0px',
						},
						{ duration: 1300, queue: false }
					);

					error.animate(
						{
							opacity: 0,
						},
						{ duration: 1300, queue: false }
					);
				}, 1000);
				setTimeout(() => {
					error.text('');
				}, 2300);
			}
		},
	}).then(function (response) {});
}
// use latitude and longitude from city return for forecast call
function getForecast(lat, lon) {
	var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=18bbe1392a0905c921468fb3545d2bfb&exclude=minutely,hourly`;
	$.ajax({
		url: queryURL,
		method: 'GET',
	}).then(function (response) {
		for (i = 1; i < 6; i++) {
			var tempF = (response.daily[i].temp.day - 273.15) * 1.8 + 32;
			var day = moment
				.unix(response.daily[i].dt)
				.utcOffset(response.timezone / 60)
				.format('MM/DD/YYYY');
			$(`h4[id="day${i - 1}"`).text(day);
			$(`span[data-foreTemp="${i - 1}"`).html(tempF.toFixed(0) + '&deg;');
			$(`span[data-foreHumi="${i - 1}"`).html(response.daily[i].humidity + '%');
			conditionImg(response.daily[i].weather[0].main, true, `day${i - 1}`);
			$('#uv').html(response.current.uvi);
			if (response.current.uvi > 8) {
				$('#uv').attr('class', 'btn btn-danger');
			} else if (response.current.uvi < 8 && response.current.uvi > 6) {
				$('#uv').attr('class', 'btn btn-warning high');
			} else if (response.current.uvi < 6 && response.current.uvi > 3) {
				$('#uv').attr('class', 'btn btn-warning');
			} else if (response.current.uvi < 3) {
				$('#uv').attr('class', 'btn btn-success');
			}
		}
	});
}
// add a list item to recent search list
function newListCity(city) {
	var newListItem = $(`<a class="list-group-item list-group-item-action">${city}</a>`);
	if ($('.list-group-item').length === 4) {
		$('.list-group-item').last().remove();
	}
	$('.city-list').prepend(newListItem);
	$('.list-group-item-action').unbind('click');
	$('.list-group-item-action').bind('click', function () {
		var recentCity = $(this).text();
		localStorage.setItem('recentCity', JSON.stringify(recentCity));
		getData(recentCity);
	});
}
// switch statement for adding animated images related to returned weather conditions
function conditionImg(condition, daytime, id) {
	switch (condition) {
		case 'Clear':
			if (daytime === true) {
				$(`#${id}-cond`).html('<img src="./assets/images/day.svg"/>');
			} else {
				$(`#${id}-cond`).html('<img src="./assets/images/night.svg"/>');
			}
			break;
		case 'Clouds':
			if (daytime === true) {
				$(`#${id}-cond`).html('<img src="./assets/images/cloudy-day.svg"/>');
			} else {
				$(`#${id}-cond`).html('<img src="./assets/images/cloudy-night.svg"/>');
			}
			break;
		case 'Rain':
			$(`#${id}-cond`).html('<img src="./assets/images/lightrain.svg"/>');
			break;
		case 'Snow':
			$(`#${id}-cond`).html('<img src="./assets/images/snow.svg"/>');
			break;
		case 'Thunderstorm':
			$(`#${id}-cond`).html('<img src="./assets/images/lightrain.svg"/>');
	}
}

$('#button-city').on('click', function () {
	newCity();
});

$('.city-input').keypress(function (event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	if (keycode === 13) {
		newCity();
	}
});
// animate foreacast objects
function animate() {
	$('.jumbotron').animate({ opacity: '1' }, 400, () => {
		$('#forecast').animate({ opacity: '1' }, 400);
	});
}
