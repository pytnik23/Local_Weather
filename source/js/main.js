function hideLoader() {
	document.getElementById('loader').style.display = 'none';
}

var weatherApp = function() {

	// define elements
	var city				= document.getElementsByClassName('city')[0],
		country 			= document.getElementsByClassName('country')[0],
		temperature 		= document.getElementsByClassName('temperature__value')[0],
		temperatureScales 	= document.getElementsByClassName('temperature__scales')[0],
		temperature_C 		= document.getElementsByClassName('temperature__scale_c')[0],
		temperature_F 		= document.getElementsByClassName('temperature__scale_f')[0],
		weatherIcon 		= document.getElementsByClassName('weather-icon')[0],
		windSpeed 			= document.getElementsByClassName('wind__speed')[0],
		windDirection		= document.getElementsByClassName('wind__direction')[0];

	// define variables
	var data 				= JSON.parse(localStorage.getItem('currentWeather')),
		currentTime 		= new Date().getTime(),
		currentTempScale	= JSON.parse(localStorage.getItem('currentTempScale')) || 'C',
		latitude,
		longitude,
		apiKey 				= '1a30526b61791bf2a0ebd807b705d950';

	// check whether the passed 1 minute since the last update
	if (data) {
		if ( (data.lastUpdate + 1*60*1000) > currentTime ) {
			console.log('1 minute not left');
			render();
			hideLoader();
		} else {
			console.log('1 minute left');
			getCurrentLocation();
		}
	} else {
		console.log('It\'s first init');
		getCurrentLocation();
	}

	// get current location
	function getCurrentLocation() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;

				// get JSON file. openweathermap API
				var xmlhttp = new XMLHttpRequest();
				var url = "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+apiKey;

				xmlhttp.onreadystatechange = function() {
				    if (this.readyState == 4 && this.status == 200) {
				        var myArr = JSON.parse(this.responseText);
				        init(myArr);
				    }
				};
				xmlhttp.open("GET", url, true);
				xmlhttp.send();

				//init();
			});
		} else {
			console.log("Geolocation API не поддерживается в вашем браузере");
			return;
		}
	}

	// app INIT
	function init(myArr) {
		data = myArr;
		// data = {
		// 	"coord": {
		// 		"lon":30.47,
		// 		"lat":50.48
		// 	},
		// 	"weather": [{
		// 		"id":801,
		// 		"main":"Clouds",
		// 		"description":"few clouds",
		// 		"icon":"02d"
		// 	}],
		// 	"base": "stations",
		// 	"main": {
		// 		"temp": 295.944,
		// 		"pressure": 1015.8,
		// 		"humidity": 64,
		// 		"temp_min": 295.944,
		// 		"temp_max": 295.944,
		// 		"sea_level": 1030.09,
		// 		"grnd_level": 1015.8
		// 	},
		// 	"wind": {
		// 		"speed": 7.36,
		// 		"deg": 234
		// 	},
		// 	"clouds": {
		// 		"all": 12
		// 	},
		// 	"dt": 1475235561,
		// 	"sys": {
		// 		"message": 0.0035,
		// 		"country": "UA",
		// 		"sunrise": 1475207874,
		// 		"sunset": 1475249811
		// 	},
		// 	"id": 703625,
		// 	"name": "Kyiv",
		// 	"cod": 200
		// };

		data.coord.lat = latitude;
		data.coord.lon = longitude;

		// store last update time
		data.lastUpdate 	= new Date().getTime();

		// calc and store currentTemp
		data.currentTempC 	= calcTemperature(data.main.temp, 'C');
		data.currentTempF 	= calcTemperature(data.main.temp, 'F');

		setCurrentTemp();

		// store data to localStorage
		localStorage.setItem('currentWeather', JSON.stringify(data));

		render();
		hideLoader();
	}

	// app RENDER
	function render() {
		city.innerHTML = data.name;
		country.innerHTML = data.sys.country;
		renderTemperature();
		weatherIcon.style.backgroundImage = "url('images/weather-icons/"+ data.weather[0].icon +".png')";
		windSpeed.innerHTML = data.wind.speed;
		windDirection.style.transform = "rotate("+ data.wind.deg +"deg)";
	}

	// calc temperature
	function calcTemperature(kelvinTemp, tempScale) {
		var temp;

		if (tempScale === "C") {
			temp = 300 - kelvinTemp;
		} else if (tempScale === "F") {
			temp = kelvinTemp * 9/5 - 459.67;
		} else {
			console.log('Error! Wrong temperature scale!');
			return;
		}

		return temp;
	}

	// set current temperature
	function setCurrentTemp() {
		if ( currentTempScale === 'C' ) {
			data.currentTemp = data.currentTempC;
		} else if ( currentTempScale === 'F' ) {
			data.currentTemp = data.currentTempF;
		} else {
			console.log('Error! setCurrentTemp function');
		}
	};

	// temperature render
	function renderTemperature() {
		if ( currentTempScale === 'C' ) {
			temperature_F.classList.remove('active');
			temperature_C.classList.add('active');
		} else if ( currentTempScale === 'F' ) {
			temperature_C.classList.remove('active');
			temperature_F.classList.add('active');
		} else {
			console.log('Error! How it happend? WTF???');
		}
		setCurrentTemp();
		temperature.innerHTML = data.currentTemp.toFixed(1);
	}

	// change temperature scale
	temperatureScales.addEventListener('click', function(e) {
		var target = e.target;
		if (target.tagName !=="A") return;
		e.preventDefault();
		if ( target.classList.contains("temperature__scale_c") ) {
			currentTempScale = 'C';
			renderTemperature();
		} else if ( target.classList.contains("temperature__scale_f") ) {
			currentTempScale = 'F';
			renderTemperature();
		} else {
			console.log('Error! What did you click?!?!?');
		}
	});

	window.onunload = function() {
		localStorage.setItem('currentTempScale', JSON.stringify(currentTempScale));
	};
};

weatherApp();








