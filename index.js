//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
window.onload = getCurrentLocInput;
document.querySelector("#submit").addEventListener("click", getInput);
function getInput() {
  let cityname = document.querySelector("#input").value;
  displayWeather(cityname);
}
function getCurrentLocInput() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}
function displayWeather(input, lat, lon) {
  let url;
  if (input == "##@") {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2d4fe8c1fe0aa971276641be9664d025&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=2d4fe8c1fe0aa971276641be9664d025&units=metric`;
  }
  console.log("url:", url);
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      console.log("displayWeather", res);
      displayData(res);
      let lat = res.coord.lat;
      let lon = res.coord.lon;
      setMap(res.name);
      for7days(lat, lon);
    })
    .catch(function (err) {
      console.log("err:", err);
    });
}

/*
includes lat and long for mumbai. In the case of a 7 day, you will need latitude and longitude coordinates.
For a 7 day forecast for Mumbai, you can use the API you tried in your second example like this:
   "https://api.openweathermap.org/data/2.5/onecall?lat=19.0760&lon=72.8777&appid={yourAPIkey}"
*/

const for7days = async function (lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=2d4fe8c1fe0aa971276641be9664d025&units=metric`;
  try {
    let res = await fetch(url);
    let data = await res.json();
    console.log("for7days", data);
    displayfor7days(data.daily);
  } catch (error) {
    console.log(error);
  }
};

function displayData(data) {
  console.log("data:", data);
  // ref: https://tecadmin.net/get-current-date-time-javascript/
  let today = new Date().toString().split(" ");
  console.log(today);
  document.querySelector(
    "#datap"
  ).innerText = `${today[0]} ${today[1]} ${today[2]} ${today[3]}`;
  document.querySelector(
    "#cityName"
  ).innerText = `${data.name}, ${data.sys.country}`;
  document.querySelector("#main").innerText = `${data.weather[0].main}`;
  let img = document.querySelector("#currTempimg");
  img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  document.querySelector("#currTemp").innerText = `${data.main.temp}°C`;
  document.querySelector("#maxTemp").innerText = `${data.main.temp_max}°C`;
  document.querySelector("#minTemp").innerText = `${data.main.temp_min}°C`;
  document.querySelector("#windspeed").innerText = `${data.wind.speed} m/s`;
  document.querySelector("#cloud").innerText = `${data.clouds.all} %`;
  // ref:https://stackoverflow.com/questions/65746475/how-to-get-data-info-from-openweathermap-api-dt
  let sunriseGMT = new Date(data.sys.sunrise * 1000).toString().split(" ");
  console.log("sunriseGMT:", sunriseGMT);
  let sunsetGMT = new Date(data.sys.sunset * 1000).toString().split(" ");
  console.log("sunsetGMT:", sunsetGMT);
  document.querySelector(
    "#sunrise"
  ).innerText = `${sunriseGMT[4]} ${sunriseGMT[5]}`;
  document.querySelector(
    "#sunset"
  ).innerText = `${sunsetGMT[4]} ${sunriseGMT[5]}`;
}

function setMap(input) {
  //https://maps.google.com/maps?q=amravati&t=&z=13&ie=UTF8&iwloc=&output=embed
  let gmap_canvas = document.querySelector("#gmap_canvas");
  gmap_canvas.src = `https://maps.google.com/maps?q=${input}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
}

function displayfor7days(data) {
  document.querySelector("#days7").innerHTML = null;
  data.splice(0, 1);
  console.log("ddisplayfor7daysata:", data);
  data.forEach(function (elem) {
    let divmain = document.createElement("div");
    let div1 = document.createElement("div");
    let img = document.createElement("img");
    img.src = `https://openweathermap.org/img/wn/${elem.weather[0].icon}@4x.png`;
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let date = new Date(elem.dt * 1000).toString().split(" ");
    // `${date[4]} ${date[5]}`;
    p1.innerText = date[0];
    p2.innerText = `${elem.temp.max}°C`;
    p3.innerText = `${elem.temp.min}°C`;
    p4.innerText = `${elem.weather[0].main}`;
    p4.setAttribute("id", "days7main");
    div1.append(img);
    divmain.append(p1, div1, p2, p3, p4);
    document.querySelector("#days7").append(divmain);
  });
}

// find current position;
// navigator.geolocation.getCurrentPosition(success, error, options);

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;
  // console.log('Your current position is:');
  // console.log(`Latitude : ${crd.latitude}`);
  // console.log(`Longitude: ${crd.longitude}`);
  // console.log(`More or less ${crd.accuracy} meters.`);
  displayWeather("##@", crd.latitude, crd.longitude);

  // displayWeatherCurrentLoc(crd.latitude,crd.longitude);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// navigator.geolocation.getCurrentPosition(success, error, options);
