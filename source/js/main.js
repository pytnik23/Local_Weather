function hideLoader() {
	document.getElementById('loader').classList.add('hide');
}

var weatherApp = function() {

	// define elements
	var city				= document.querySelector('.city'),
		country 			= document.querySelector('.country'),
		temperature 		= document.querySelector('.temperature__value'),
		temperatureScales 	= document.querySelector('.temperature__scales'),
		temperature_C 		= document.querySelector('.temperature__scale_c'),
		temperature_F 		= document.querySelector('.temperature__scale_f'),
		weatherDescription	= document.querySelector('.weather-description'),
		weatherIcon 		= document.querySelector('.weather-icon'),
		windSpeed 			= document.querySelector('.wind__speed'),
		windDirection		= document.querySelector('.wind__direction'),
		backgroundImage 	= document.querySelector('.background-image');

	// define variables
	var data 				= JSON.parse(localStorage.getItem('currentWeather')),
		flickrImages 		= JSON.parse(localStorage.getItem('flickrImages')),
		currentTime 		= new Date().getTime(),
		currentTempScale	= JSON.parse(localStorage.getItem('currentTempScale')) || 'C',
		latitude,
		longitude;

	// check whether the passed 1 minute since the last update
	if (data) {
		if ( (data.lastUpdate + 1*60*1000) > currentTime ) {
			console.log('1 minute not left');
			setBG();
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

				var location = latitude + "," + longitude;

				var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?q=';
				weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="(' + location + ')") and u="c"';
				weatherUrl += '&format=json';
				// Create the XHR object.
				function createCORSRequest(method, url) {
				  var xhr = new XMLHttpRequest();
				  if ("withCredentials" in xhr) {
				    // XHR for Chrome/Firefox/Opera/Safari.
				    xhr.open(method, url, true);
				  } else if (typeof XDomainRequest != "undefined") {
				    // XDomainRequest for IE.
				    xhr = new XDomainRequest();
				    xhr.open(method, url);
				  } else {
				    // CORS not supported.
				    xhr = null;
				  }
				  return xhr;
				}

				// Make the actual CORS request.
				function makeCorsRequest(url) {

				  var xhr = createCORSRequest('GET', url);
				  if (!xhr) {
				    alert('CORS not supported');
				    return;
				  }

				  // Response handlers.
				  xhr.onload = function() {
				    data = JSON.parse(xhr.responseText);
				    init();
				  };

				  xhr.onerror = function() {
				    alert('Woops, there was an error making the request.');
				  };

				  xhr.send();
				}
				makeCorsRequest(weatherUrl);

			});
		} else {
			alert("Geolocation API не поддерживается в вашем браузере");
			return;
		}
	}

	// app INIT
	function init() {
		// store last update time
		data.lastUpdate 	= new Date().getTime();

		data.currentTempC 	= +data.query.results.channel.item.condition.temp;
		data.currentTempF 	= +calcTemperature(data.currentTempC, 'F');

		data.bgImageUrl 	= "url('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/" + data.query.results.channel.item.condition.code + "d.png')";

		setCurrentTemp();

		data.weatherDescription = data.query.results.channel.item.condition.text;

		// store data to localStorage
		localStorage.setItem('currentWeather', JSON.stringify(data));
		getBG();
		render();
		hideLoader();
	}

	// app RENDER
	function render() {
		city.innerHTML = data.query.results.channel.location.city;
		country.innerHTML = data.query.results.channel.location.country;
		renderTemperature();
		weatherDescription.innerHTML = data.weatherDescription;
		weatherIcon.style.backgroundImage = data.bgImageUrl;
		windSpeed.innerHTML = data.query.results.channel.wind.speed;
		windDirection.style.transform = "rotate("+ data.query.results.channel.wind.direction +"deg)";
	}

	// calc temperature
	function calcTemperature(celciusTemp, tempScale) {
		var temp;

		if (tempScale === "C") {
			temp = celciusTemp;
		} else if (tempScale === "F") {
			temp = celciusTemp * 9/5 + 32;
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
			temperature.classList.remove('f');
			temperature.classList.add('c');
		} else if ( currentTempScale === 'F' ) {
			temperature_C.classList.remove('active');
			temperature_F.classList.add('active');
			temperature.classList.remove('c');
			temperature.classList.add('f');
		} else {
			console.log('Error! How it happend? WTF???');
		}
		setCurrentTemp();
		temperature.innerHTML = data.currentTemp.toFixed(0);
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

	
	// Flickr API section

	function getBG() {

		var url = '';
		url += 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
		url += '&format=json';
		url += '&nojsoncallback=1';
		url += '&tags=street,nature';
		url += '&text='+data.query.results.channel.location.city;
		url += '&content_type=1';
		//url += '&geo_context=2';
		//url += '&per_page=100';
		url += '&api_key=8c9031edcdb082525d3ebedc68843828';

		// Flickr request
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function() {
		  flickrImages = JSON.parse(this.responseText);
		  console.dir(flickrImages);
		  initBG();
		};
		xhr.onerror = function() {
		  console.log('[Flickr] Error!');
		};
		xhr.send();
	}

	function initBG() {
		localStorage.setItem('flickrImages', JSON.stringify(flickrImages));
		setBG();
	}

	function setBG() {
		var randomPhoto 	= Math.floor(Math.random() * 100),
			displayHeight 	= document.documentElement.clientHeight;

		var farm 	= flickrImages.photos.photo[randomPhoto].farm,
			server 	= flickrImages.photos.photo[randomPhoto].server,
			id 		= flickrImages.photos.photo[randomPhoto].id,
			secret 	= flickrImages.photos.photo[randomPhoto].secret,
			size;

		if ( displayHeight < 640 ) {
			size = 'z';
		} else if ( displayHeight < 800 ) {
			size = 'c';
		} else if ( displayHeight < 1024 ) {
			size = 'b';
		} else if ( displayHeight < 1600 ) {
			size = 'h';
		} else {
			size = 'k';
		}

		var imgLink = 'https://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'_'+size+'.jpg';

		backgroundImage.style.backgroundImage = "url("+imgLink+")";
	}

	window.onunload = function() {
		localStorage.setItem('currentTempScale', JSON.stringify(currentTempScale));
	};
};

weatherApp();








