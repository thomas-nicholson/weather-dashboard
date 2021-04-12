
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
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistory)
        queryApi("Canberra", true);
    else {
        queryApi(searchHistory[0], false);
        renderSaveList(document.getElementById("search-history"), searchHistory.slice(-10));
    }    
}

function renderWeatherData(data, displayName) {
    for (var i = 0; i < 6; i++) {
        if (i===0) {
            var todayEl = document.getElementById("weather-today");

            var headerEl = todayEl.getElementsByClassName("card-title")[0];
            headerEl.textContent = "";

            var headerText = displayName + ", "+ moment.unix(data.current.dt).format("DD/MM/YYYY");

            var headerNode = document.createTextNode(headerText);

            var icon = document.createElement("img");
            icon.setAttribute("src", "http://openweathermap.org/img/wn/"+ data.current.weather[0].icon +"@2x.png");
            headerEl.appendChild(headerNode);
            headerEl.appendChild(icon);

            //Render general weather info
            var info = "Temperature: "+ data.current.temp+ "°C "+ "Wind Speed: " +data.current.wind_speed+ "KM/H "+ "Humidity: "+ data.current.humidity+ "%";
            var infoNode = document.createTextNode(info);
            var infoEl = todayEl.getElementsByClassName("card-text")[0];
            infoEl.textContent = "";
            infoEl.appendChild(infoNode);

            //Render UV Index
            var uvIndex = document.createTextNode(data.current.uvi);
            continue;
        } 
     
        var dayCard = document.getElementsByClassName("forecast-card")[i-1];

        var cardTitle = dayCard.getElementsByClassName("card-title")[0];
        cardTitle.textContent = "";

        var titleText = moment.unix(data.daily[i].dt).format("DD/MM/YY");

        var titleNode = document.createTextNode(titleText);

        var cardIcon = document.createElement("img");
        cardIcon.setAttribute("src", "http://openweathermap.org/img/wn/"+ data.daily[i].weather[0].icon +"@2x.png");
        cardTitle.appendChild(titleNode);
        cardTitle.appendChild(cardIcon);

        var cardInfoEl = dayCard.getElementsByClassName("card-text")[0];
        cardInfoEl.textContent = "";

        var tempNode = document.createTextNode("Temp: "+ data.daily[i].temp.day+ "°C \n");
        cardInfoEl.appendChild(tempNode);
        cardInfoEl.appendChild(document.createElement("hr"));

        var windNode = document.createTextNode("Wind Speed: " +data.daily[i].wind_speed+ "KM/H \n");
        cardInfoEl.appendChild(windNode);
        cardInfoEl.appendChild(document.createElement("hr"));

        var humidityNode = document.createTextNode("Humidity: "+ data.daily[i].humidity+ "%");
        cardInfoEl.appendChild(humidityNode);

        //Render UV Index
        var uvIndex = document.createTextNode(data.daily[i].uvi);
    }
}

function queryApi(string, shouldStore) {
    var coordsUrl = "https://nominatim.openstreetmap.org/search?q="+ string +"&format=json"
    if (shouldStore)
        storeSaveHistory(string);

    fetch(coordsUrl)
        .then(data=>{return data.json()})
        .then(coordRes=>{
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ coordRes[0].lat +"&lon="+ coordRes[0].lon +"&exclude=minutely,hourly,alerts&units=metric&appid=3390aa6a22b2eca7d2d686288ec5e2f7"
            fetch(weatherUrl)
                .then(data=>{return data.json()})
                .then(res=>{
                    renderWeatherData(res, coordRes[0].display_name.split(",")[0]);
                });
        });
}

document.getElementById("search").addEventListener("submit", function(e) {
    e.preventDefault();

    var searchBox = document.getElementById("queryString");

    var queryString = searchBox.value;
    searchBox.value = "";


    if (queryString === "")
        return;
    queryApi(queryString, true);

});

document.getElementById("search-history").addEventListener("click",function(e) {
    if(e.target && e.target.nodeName == "LI") {
        queryApi(e.target.textContent, false);
    }
});

getSaveHistory();