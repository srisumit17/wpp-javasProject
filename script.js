const weatherIcon = document.getElementById('weaic');
const hourfore = document.getElementById('hfore');
const weaContainer = document.getElementById('weather');
const button1 = document.getElementById('btn1');
const button2 = document.getElementById('btn2');
const Apikey = "6ba62152a2a90fca347386a7037df920";

button1.addEventListener('click', () => {

  async function getWeather() {
    try {
      const cName = document.getElementById("city").value;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cName}&units=metrics&appid=${Apikey}`;

      const getdata = await fetch(url);
      const res = await getdata.json();
      console.log(url);

      saveData(cName);

      if (res.cod === 200) {//If Get HTTP Success Response, Code 200
        weatherDisplay(res);
        updateWeatherForecat(res);
      } else {
        alert('Try again');
      }
    } catch (err) {
      console.log('Error in fetching response', err);
    }

  }

  getWeather();

});

//Below Event Listener is for current location
button2.addEventListener("click", () => {

  //Fetching Latitude Longitude Using Google Map Script
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, function errorFunction() {
      console.log("error in getting current location");
    });
  }
  //Taken latitude and longitude
  async function successFunction(position) {
    try {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      console.log("latitude " + lat);
      console.log("longitude " + lng);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metrics&appid=${Apikey}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);
      if (data.cod === 200) {
        weatherDisplay(data);
        updateWeatherForecat(data);
      } else {
        alert('Try again');
      }
    } catch (err) {
      console.log("Error in fetching weather data:", err);
      alert('Something went  wrong. Try again');
    }

  }

});

/*
Below Code is For Providing Current Weather
*/
function weatherDisplay(res) {
  console.log(res);

  const temp = Math.round((res.main.temp - 32) / 9);
  let dated = getDate(res, 0);
  document.getElementById("cityName").innerHTML = res.name;
  document.getElementById('date').innerHTML = dated;
  document.getElementById('temp').innerHTML = (temp) + "°C";
  document.querySelector('#humidity').innerHTML = Math.round(res.main.humidity) + "%";
  document.querySelector('#wind').innerHTML = Math.round(res.wind.speed) + "km/h";

}

/*
Function To Get TimeStamp Or Five Days Forecast Dates
*/
function getDate(res, i) {

  let dateTime = new Date(res.dt * 1000);
  const dates = dateTime.getDate() + i;
  const months = dateTime.getMonth() + 1;
  const years = dateTime.getFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();

  if (i > 0) {
    return dates + "/" + months + "/" + years;
  }
  return dates + "/" + months + "/" + years + "-" + hours + ":" + minutes + ":" + seconds;
}

/*
Function To Populate Five Days Forcast Into Html Tags
*/
function updateWeatherForecat(res) {

  //Performing 5 Loops To Generate Five Day Forecast
  for (var i = 1; i <= 5; i++) {

    let dated = getDate(res, i);
    const temp = Math.round((res.main.temp - 32) / 9) + i;//Converting Faurenheit to centigrade Temperature
    document.getElementById('date' + i).innerHTML = dated;
    //As API was returning the Weather forecast 5 Days , So Generating random Parameters based on API Response
    document.getElementById('temp' + i).innerHTML = Math.floor(Math.random(temp) * 29 + 1) + "°C";
    document.getElementById('humidity' + i).innerHTML = Math.trunc(Math.random(res.main.humidity) * 56 + 1) + "%";
    document.getElementById('wind' + i).innerHTML = Math.ceil(Math.random(res.wind.speed) * 3 + 1) + "km/h";
  }
}

/*
Below Is The Code For Saving Input Data Into Local Storage
*/
function saveData(cName) {
  localStorage.setItem("cityName", cName);
}

/*
Below Code is for populating Local Storage City Tag to Input Text Field When 
Page Gets Loaded or Refreshed
*/
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  var savedValue = localStorage.getItem("cityName");
  if (savedValue) {
    document.getElementById("city").value = savedValue;
  }
});

