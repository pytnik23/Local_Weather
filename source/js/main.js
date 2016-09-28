if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;

		console.log(latitude);
		console.log(longitude);


	});
} else {
	console.log("Geolocation API не поддерживается в вашем браузере");
}



// Examples of API calls
// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}

// API key
// 1a30526b61791bf2a0ebd807b705d950
