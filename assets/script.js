
function renderSaveList(ul, searchHistory) {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    for (i in searchHistory) {
        var li = document.createElement("li");
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

    if (searchHistory.length >10)
        searchHistory.slice(-1);
    
    renderSaveList(document.getElementById("search-history"), searchHistory);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory.slice(-10)));
}

function getSaveHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")).slice(-10);
    renderSaveList(document.getElementById("search-history"), searchHistory);
    return searchHistory;
}

document.getElementById("search").addEventListener("submit", function(e) {
    e.preventDefault();

    var searchBox = document.getElementById("queryString");

    var coordsUrl = "https://nominatim.openstreetmap.org/search?q="+ searchBox.value +"&format=json"
    storeSaveHistory(searchBox.value);
    searchBox.value = "";
    fetch(coordsUrl)
        .then(data=>{return data.json()})
        .then(coordRes=>{
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ coordRes[0].lat +"&lon="+ coordRes[0].lon +"&exclude=current,minutely,hourly,alerts&appid=3390aa6a22b2eca7d2d686288ec5e2f7"
            fetch(weatherUrl)
                .then(data=>{return data.json()})
                .then(res=>{console.log(res)});
        });
});

getSaveHistory();