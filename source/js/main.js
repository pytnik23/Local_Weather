var ready = function ( fn ) {

    // Sanity check
    if ( typeof fn !== 'function' ) return;

    // If document is already loaded, run method
    if ( document.readyState === 'complete'  ) {
        return fn();
    }

    // Otherwise, wait until document is loaded
    // The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading. The state indicates that the DOMContentLoaded event has been fired.
    document.addEventListener( 'interactive', fn, false );

    // Alternative: The document and all sub-resources have finished loading. The state indicates that the load event has been fired.
    // document.addEventListener( 'complete', fn, false );

};

// Example
ready(function() {
	var latitude = 0,
		longitude = 0;
	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
		});
	} else {
		alert("Geolocation API не поддерживается в вашем браузере");
	}
	console.log(latitude);
	console.log(longitude);

});

// Examples of API calls
// api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}

// API key
// 1a30526b61791bf2a0ebd807b705d950
