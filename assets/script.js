
function renderSaveList(ul, searchHistory) {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    for (i in searchHistory) {
        var li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        var textNode = document.createTextNode(searchHistory[i]);
        li.appendChild(textNode);
        ul.insertBefore(li, ul.firstChild);
    }
}

function storeSaveHistory(queryString) {

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistory) {
        searchHistory = [];
    }
    searchHistory.push(queryString);

    if (searchHistory.length >9)
        searchHistory.slice(-1);
    
    renderSaveList(document.getElementById("search-history"), searchHistory);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory.slice(-10)));
}

function getSaveHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")).slice(-10);
    renderSaveList(document.getElementById("search-history"), searchHistory);
    return searchHistory;
}

function renderWeatherData(data) {
    for (var i = 0; i < 7; i++) {
        if (i===0) {
            var todayEl = document.getElementById("weather-today");
            var text = document.createTextNode(data.current.temp);
            todayEl.appendChild(text)
        } 
    }
}

document.getElementById("search").addEventListener("submit", function(e) {
    e.preventDefault();

    var searchBox = document.getElementById("queryString");

    var queryString = searchBox.value;

    if (queryString === "")
        return;

    var coordsUrl = "https://nominatim.openstreetmap.org/search?q="+ queryString +"&format=json"
    storeSaveHistory(queryString);
    searchBox.value = "";
    fetch(coordsUrl)
        .then(data=>{return data.json()})
        .then(coordRes=>{
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ coordRes[0].lat +"&lon="+ coordRes[0].lon +"&exclude=minutely,hourly,alerts&units=metric&appid=3390aa6a22b2eca7d2d686288ec5e2f7"
            fetch(weatherUrl)
                .then(data=>{return data.json()})
                .then(res=>{
                    console.log(res);
                    renderWeatherData(res);
                });
        });
});

getSaveHistory();