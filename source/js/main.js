document.getElementById('loader').style.display = 'none';

var weatherApp = function() {

	// define elements
	var city				= document.getElementsByClassName('city')[0],
		country 			= document.getElementsByClassName('country')[0],
		temperature 		= document.getElementsByClassName('temperature__value')[0],
		temperatureScales 	= document.getElementsByClassName('temperature__scales')[0],
		weatherImage 		= document.getElementsByClassName('weather-image__item')[0],
		windSpeed 			= document.getElementsByClassName('wind__speed')[0],
		windDirection		= document.getElementsByClassName('wind__direction')[0];

	// define variables
	var data 			= JSON.parse(localStorage.getItem('currentWeather')),
		currentTime 	= new Date().getTime(),
		latitude,
		longitude,
		tempScale 		= data.tempScale || "C",
		currentTemp     = data.currentTemp,
		apiKey 			= '1a30526b61791bf2a0ebd807b705d950';

	// check whether the passed 1 minute since the last update
	if (data) {
		if ( (data.lastUpdate + 1*60*1000) > currentTime ) {
			console.log('1 minute not left');
			render();
		} else {
			console.log('1 minute left');
			init();
		}
	} else {
		init();
	}

	// app init
	function init() {

		//geolocation identification
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
			});
		} else {
			console.log("Geolocation API не поддерживается в вашем браузере");
			return;
		}

		// get JSON file. openweathermap API
		//data = "api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+apiKey;
		data = {
			"coord":{"lon":49.4309808,"lat":31.9086219},
			"sys":{"country":"UA","sunrise":1369769524,"sunset":1369821049},
			"weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],
			"main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
			"wind":{"speed":7.31,"deg":187.002},
			"rain":{"3h":0},
			"clouds":{"all":92},
			"dt":1369824698,
			"id":1851632,
			"name":"Shuzenji",
			"cod":200
		};

		// store last update time
		data.lastUpdate = new Date().getTime();

		data.tempScale = tempScale;

		data.currentTemp = calcTemperature(data.main.temp, tempScale);

		// store data to localStorage
		localStorage.setItem('currentWeather', JSON.stringify(data));


		render();
	}

	// get temperature
	function getTemperature() {
		currentTemp = calcTemperature(data.main.temp, tempScale);
		data.currentTemp = currentTemp;
		renderTemperature();
	}

	// calc temperature
	function calcTemperature(kelvinTemp, scale) {
		var scale = scale,
			temp;

		if (scale === "C") {
			console.log('C');
			temp = 300 - kelvinTemp;
		} else if (scale === "F") {
			console.log('F');
			temp = kelvinTemp * 9/5 - 459.67;
		} else {
			console.log('Error! Wrong temperature scale!');
			return;
		}

		return temp.toFixed(1);
	}

	// app render
	function render() {
		country.innerHTML = data.sys.country;
		temperature.innerHTML = data.currentTemp;
		windSpeed.innerHTML = data.wind.speed;
		windDirection.innerHTML = data.wind.deg;
	}

	// temperature render
	function renderTemperature() {
		temperature.innerHTML = currentTemp;
	}

	// change temperature scale
	temperatureScales.addEventListener('click', function(e) {
		var target = e.target;
		if (target.tagName !=="A") return;
		e.preventDefault();
		if ( target.classList.contains("temperature__scale_c") ) {
			tempScale = "C";
			document.getElementsByClassName('temperature__scale_f')[0].classList.remove('active');
			target.classList.add('active');
			getTemperature();
		} else if ( target.classList.contains("temperature__scale_f") ) {
			tempScale = "F";
			document.getElementsByClassName('temperature__scale_c')[0].classList.remove('active');
			target.classList.add('active');
			getTemperature();
		} else {
			console.log('Error! temperatureScales does not exist');
		}
	});

};

weatherApp();

// document.addEventListener("DOMContentLoaded", function(e) {
//
// });





