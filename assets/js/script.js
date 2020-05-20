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

