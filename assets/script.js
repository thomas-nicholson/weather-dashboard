document.getElementById("search").addEventListener("submit", function(e) {
    e.preventDefault();

    var searchBox = document.getElementById("queryString");

    console.log(queryString);
    var coordsUrl = "https://nominatim.openstreetmap.org/search?q="+ searchBox.value +"&format=json"
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