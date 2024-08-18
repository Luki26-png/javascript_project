let submitButton = document.getElementById('submit-button');
let inputedCity = "";
let cityCoordinates = {
  inputedCityLatitude : 0,
  inputedCityLongitude : 0
};

let weather = {
  temperature : 0,
  daylightDuration : 0,
  rainSum : 0,
  UVIndex : 0,
  windSpeed : 0
};

let weatherInfoHTML = {
  temperature : document.getElementById('temperature'),
  daylightDuration : document.getElementById('daylight'),
  UVIndex : document.getElementById('uv'),
  rainSum : document.getElementById('rain'),
  windSpeed : document.getElementById('wind')
};

//funct to make http request 
function makeHttpRequest(url, responseHandler) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onload = function(){responseHandler(this);}
  httpRequest.open("GET", url);
  httpRequest.send();  
};

//function to handle city coordinate response from server
function handleCityCoordResponse(Response){
  const responseData = JSON.parse(Response.response);
  //console.log(responseData)
  cityCoordinates.inputedCityLatitude = responseData[0]["lat"];
  cityCoordinates.inputedCityLongitude = responseData[0]["lon"];
};

//function to handle city weather condition response from server
function handleCityWeatherResponse(Response){
  const responseData = JSON.parse(Response.response);
  //console.log(responseData);
  weather.temperature = responseData["daily"]["apparent_temperature_max"][6];
  weather.daylightDuration = responseData["daily"]["daylight_duration"][6];
  weather.rainSum = responseData["daily"]["rain_sum"][6];
  weather.UVIndex = responseData["daily"]["uv_index_max"][3];
  weather.windSpeed = responseData["daily"]["wind_speed_10m_max"][6];

  console.log(`latitude = ${cityCoordinates.inputedCityLatitude}`);
  console.log(`longitude = ${cityCoordinates.inputedCityLongitude}`);
  console.log(`Temperature = ${weather.temperature} Celcius`);

  weatherInfoHTML.temperature.innerHTML = `Temperature : ${weather.temperature} Celcius`;
  weatherInfoHTML.daylightDuration.innerHTML= `Daylight Duration : ${weather.daylightDuration} s`;
  weatherInfoHTML.rainSum.innerHTML= `Rain Sum : ${weather.rainSum} mm`;
  weatherInfoHTML.UVIndex.innerHTML= `UV Index : ${weather.UVIndex}`;
  weatherInfoHTML.windSpeed.innerHTML= `Wind Speed : ${weather.windSpeed} km/h`;
};

//action when users click submit button
submitButton.addEventListener('click',()=>{
  inputedCity = document.getElementById('city-input').value;
  console.log(inputedCity);
  let promiseCoordinates = new Promise((resolve, reject)=>{
    //http req to get city coordinate
    makeHttpRequest(`http://api.openweathermap.org/geo/1.0/direct?q=${inputedCity}&limit=1&appid=baf913e59db9e040fea80e5bf4433120`, handleCityCoordResponse);
    resolve(cityCoordinates);
  });
  
  //http req to get city weather condition
  promiseCoordinates.then((result)=>{
    makeHttpRequest(`https://api.open-meteo.com/v1/forecast?latitude=${result.inputedCityLatitude}&longitude=${result.inputedCityLongitude}&daily=temperature_2m_max,apparent_temperature_max,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max`,handleCityWeatherResponse)
  });
});

//note open() and send() method in xmlhttprequest object is asynchronous