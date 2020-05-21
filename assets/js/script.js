// on search button click, set new var to input value
// print to new list item and save to localStorage

function newCity() {
    var newCity = $('input').val();
    var newListItem = $(`<li class="list-group-item">${newCity}</li>`);
    if ($('.list-group-item').length === 8) {
        $('.list-group-item').last().remove();
    }
    $('.city-list').prepend(newListItem);
    localStorage.setItem('recentCity', JSON.stringify(newCity));
    getData(newCity);
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
        $('.uv').html();
        getForecast(lat, lon);
    })
}

function getForecast(lat, lon) {
    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=18bbe1392a0905c921468fb3545d2bfb`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        for (i = 0; i < 5; i++) {
            var tempF = (response.list[i].main.temp_max - 273.15) * 1.80 + 32;
            $(`span[data-foreTemp="${i}"`).text(tempF.toFixed(0));
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