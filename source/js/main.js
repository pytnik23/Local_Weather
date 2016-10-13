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
		//apiKey 				= '1a30526b61791bf2a0ebd807b705d950';
		apiKey 				= '07384ebfcecc402230f46dd9b2267474';

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


				// The web services request minus the domain name
				var path = latitude + ',' + longitude;

				// The full path to the PHP proxy
				var url = 'http://localhost/php_proxy_simple.php?yws_path=' + encodeURIComponent(path);

				// Cross platform xmlhttprequest

				// Create xmlhttprequest object
				var xmlhttp = null;
				if (window.XMLHttpRequest) {
				        xmlhttp = new XMLHttpRequest();
				        //make sure that Browser supports overrideMimeType
				        if ( typeof xmlhttp.overrideMimeType != 'undefined') { xmlhttp.overrideMimeType('application/json'); }
				} else if (window.ActiveXObject) {
				        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}  else {
				        alert('Perhaps your browser does not support xmlhttprequests?');
				}

				// Create an HTTP GET request
				xmlhttp.open('GET', url, true);

				// Set the callback function
				xmlhttp.onreadystatechange = function() {
				        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				                // Output the results
				    			  alert(xmlhttp.responseText);
				        } else {
				      			// waiting for the call to complete
				        }
				    };

				// Make the actual request
				xmlhttp.send(null);


				// var link = "https://api.darksky.net/forecast/" + apiKey + '/' + latitude + "," + longitude;

				// var xhr = new XMLHttpRequest();
				// xhr.open("GET", link, true);
				// xhr.send();
				// xhr.onerror = function() {
				// 	console.log('Error!');
				// }
				// xhr.onload = function() {
				// 	console.log(this.responseText);
				// }

				// function addScript(src) {
				//   var elem = document.createElement("script");
				//   elem.src = src;
				//   document.head.appendChild(elem);
				// }

				// function onUserData(obj) {
				// 	console.log(obj);
				// }
				// addScript(link);


				// // Create the XHR object.
				// function createCORSRequest(method, url) {
				//   var xhr = new XMLHttpRequest();
				//   if ("withCredentials" in xhr) {
				//     // XHR for Chrome/Firefox/Opera/Safari.
				//     xhr.open(method, url, true);
				//   } else if (typeof XDomainRequest != "undefined") {
				//     // XDomainRequest for IE.
				//     xhr = new XDomainRequest();
				//     xhr.open(method, url);
				//   } else {
				//     // CORS not supported.
				//     xhr = null;
				//   }
				//   return xhr;
				// }

				// // Helper method to parse the title tag from the response.
				// function getTitle(text) {
				//   return text.match('<title>(.*)?</title>')[1];
				// }

				// // Make the actual CORS request.
				// function makeCorsRequest() {

				//   var xhr = createCORSRequest('GET', link);
				//   if (!xhr) {
				//     alert('CORS not supported');
				//     return;
				//   }

				//   // Response handlers.
				//   xhr.onload = function() {
				//     data = xhr.responseText;
				//     console.log(data);
				//     var title = getTitle(text);
				//     alert('Response from CORS request to ' + link + ': ' + title);
				//   };

				//   xhr.onerror = function() {
				//     alert('Woops, there was an error making the request.');
				//   };

				//   xhr.send();
				// }
				// makeCorsRequest();
			});
		} else {
			console.log("Geolocation API не поддерживается в вашем браузере");
			return;
		}
	}

	// app INIT
	function init() {

		// store last update time
		data.lastUpdate 	= new Date().getTime();

		// calc and store currentTemp
		//data.currentTempC 	= calcTemperature(data.main.temp, 'C');
		data.currentTempC 	= data.currently.temperature;
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








