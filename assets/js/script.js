if (localStorage.getItem('recentCity') === null) {
    getData('Austin');
} else {
    $('#initial').text(JSON.parse(localStorage.getItem('recentCity')));
    var recentCity = JSON.parse(localStorage.getItem('recentCity'));
    getData(recentCity);
}

// on search button click, set new var to input value
// print to new list item and save to localStorage

function newCity() {
    var newCity = $('input').val();
    var newListItem = $(`<a class="list-group-item list-group-item-action">${newCity}</a>`);
    if ($('.list-group-item').length === 8) {
        $('.list-group-item').last().remove();
    }
    $('.city-list').prepend(newListItem);
    localStorage.setItem('recentCity', JSON.stringify(newCity));

    getData(newCity);
    // on recent city click, populate data and refresh localStorage
    $('.list-group-item-action').on('click', function(){
        var recentCity = $(this).text();
        localStorage.setItem('recentCity', JSON.stringify(recentCity));
        getData(recentCity);
    });
    // clear input text
    $('input').val('');
};

function getData(newCity) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&APPID=18bbe1392a0905c921468fb3545d2bfb";
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        var m = moment().format('MM/DD/YYYY');
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log(response);
        $('#city').text(response.name + ' ' + m);
        $('.temp').html(tempF.toFixed(0) + '&deg;');
        $('.humid').html(response.main.humidity + '%');
        $('.wind').html((response.wind.speed * 2.237).toFixed(0) + ' MPH');
        getForecast(lat, lon);
    })
}

function getForecast(lat, lon) {
    var queryURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=18bbe1392a0905c921468fb3545d2bfb&exclude=minutely,hourly`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        for (i = 0; i < 5; i++) {
            var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
            var day = moment.unix(response.daily[i].dt).format("MM/DD/YYYY");
            $(`h4[id="day${i}"`).text(day);
            $(`span[data-foreTemp="${i}"`).text(tempF.toFixed(0));
            $(`span[data-foreHumi="${i}"`).text(response.daily[i].humidity + '%');
            $('.uv').html(response.current.uvi);
        }
    })
}

$('#button-city').on('click', function(){
    newCity();
});

$('.city-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13) {
        newCity();
    }
});