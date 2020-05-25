if (localStorage.getItem('recentCity') === null) {
    getData('Austin');
    newListCity('Austin');
} else {
    var recentCity = JSON.parse(localStorage.getItem('recentCity'));
    getData(recentCity);
    newListCity(recentCity);
}

// on search button click, set new var to input value
// print to new list item and save to localStorage

function newCity() {
    var newCity = $('input').val();
    newCity = newCity.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    localStorage.setItem('recentCity', JSON.stringify(newCity));
    getData(newCity);
    newListCity(newCity);
    // on recent city click, populate data and refresh localStorage
    // clear input text
    $('input').val('');
};

function getData(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=18bbe1392a0905c921468fb3545d2bfb";
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        var m = moment.unix(response.dt).utcOffset(response.timezone / 60).format('MM/DD/YYYY');
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var dayTime = (response.dt > response.sys.sunrise && response.dt < response.sys.sunset);
        console.log(dayTime);
        console.log(response);
        $('#city').text(response.name + ' ' + m);
        $('.temp').html(tempF.toFixed(0) + '&deg;');
        $('.humid').html(response.main.humidity + '%');
        $('.wind').html((response.wind.speed * 2.237).toFixed(0) + ' MPH');
        conditionImg(response.weather[0].main, dayTime, 'current');
        getForecast(lat, lon);
    })
}

function getForecast(lat, lon) {
    var queryURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=18bbe1392a0905c921468fb3545d2bfb&exclude=minutely,hourly`;
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).then(function(response) {
        for (i = 0; i < 5; i++) {
            var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
            var day = moment.unix(response.daily[i].dt).utcOffset(response.timezone / 60).format("MM/DD/YYYY");
            $(`h4[id="day${i}"`).text(day);
            $(`span[data-foreTemp="${i}"`).text(tempF.toFixed(0));
            $(`span[data-foreHumi="${i}"`).text(response.daily[i].humidity + '%');
            conditionImg(response.daily[i].weather[0].main, true, `day${i}`);
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
    })
}

function newListCity(city) {
    var newListItem = $(`<a class="list-group-item list-group-item-action">${city}</a>`);
    if ($('.list-group-item').length === 5) {
        $('.list-group-item').last().remove();
    }
    $('.city-list').prepend(newListItem);
    $('.list-group-item-action').unbind('click');
    $('.list-group-item-action').bind('click', function(){
        var recentCity = $(this).text();
        localStorage.setItem('recentCity', JSON.stringify(recentCity));
        getData(recentCity);
    });
}

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
};

$('#button-city').on('click', function(){
    newCity();
});

$('.city-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13) {
        newCity();
    }
});