function hideLoader(){document.getElementById("loader").classList.add("hide")}var weatherApp=function(){function e(){return navigator.geolocation?void navigator.geolocation.getCurrentPosition(function(e){function r(e,t){var r=new XMLHttpRequest;return"withCredentials"in r?r.open(e,t,!0):"undefined"!=typeof XDomainRequest?(r=new XDomainRequest,r.open(e,t)):r=null,r}function o(e){var o=r("GET",e);return o?(o.onload=function(){_=JSON.parse(o.responseText),t()},o.onerror=function(){alert("Woops, there was an error making the request.")},void o.send()):void alert("CORS not supported")}l=e.coords.latitude,u=e.coords.longitude;var n=l+","+u,c="https://query.yahooapis.com/v1/public/yql?q=";c+='select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="('+n+')") and u="c"',c+="&format=json",o(c)}):void alert("Geolocation API не поддерживается в вашем браузере")}function t(){_.lastUpdate=(new Date).getTime(),_.currentTempC=+_.query.results.channel.item.condition.temp,_.currentTempF=+o(_.currentTempC,"F"),_.bgImageUrl="url('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/"+_.query.results.channel.item.condition.code+"d.png')",n(),_.weatherDescription=_.query.results.channel.item.condition.text,localStorage.setItem("currentWeather",JSON.stringify(_)),a(),r(),hideLoader()}function r(){d.innerHTML=_.query.results.channel.location.city,m.innerHTML=_.query.results.channel.location.country,c(),y.innerHTML=_.weatherDescription,v.style.backgroundImage=_.bgImageUrl,S.innerHTML=_.query.results.channel.wind.speed,q.style.transform="rotate("+_.query.results.channel.wind.direction+"deg)"}function o(e,t){var r;if("C"===t)r=e;else{if("F"!==t)return void console.log("Error! Wrong temperature scale!");r=9*e/5+32}return r}function n(){"C"===k?_.currentTemp=_.currentTempC:"F"===k?_.currentTemp=_.currentTempF:console.log("Error! setCurrentTemp function")}function c(){"C"===k?(h.classList.remove("active"),f.classList.add("active"),p.classList.remove("f"),p.classList.add("c")):"F"===k?(f.classList.remove("active"),h.classList.add("active"),p.classList.remove("c"),p.classList.add("f")):console.log("Error! How it happend? WTF???"),n(),p.innerHTML=_.currentTemp.toFixed(0)}function a(){var e="";e+="https://api.flickr.com/services/rest/?method=flickr.photos.search",e+="&format=json",e+="&nojsoncallback=1",e+="&tags=street,nature",e+="&text="+_.query.results.channel.location.city,e+="&content_type=1",e+="&api_key=8c9031edcdb082525d3ebedc68843828";var t=new XMLHttpRequest;t.open("GET",e,!0),t.onload=function(){T=JSON.parse(this.responseText),console.dir(T),s()},t.onerror=function(){console.log("[Flickr] Error!")},t.send()}function s(){localStorage.setItem("flickrImages",JSON.stringify(T)),i()}function i(){var e,t=Math.floor(100*Math.random()),r=document.documentElement.clientHeight,o=T.photos.photo[t].farm,n=T.photos.photo[t].server,c=T.photos.photo[t].id,a=T.photos.photo[t].secret;e=r<640?"z":r<800?"c":r<1024?"b":r<1600?"h":"k";var s="https://farm"+o+".staticflickr.com/"+n+"/"+c+"_"+a+"_"+e+".jpg";w.style.backgroundImage="url("+s+")"}var l,u,d=document.querySelector(".city"),m=document.querySelector(".country"),p=document.querySelector(".temperature__value"),g=document.querySelector(".temperature__scales"),f=document.querySelector(".temperature__scale_c"),h=document.querySelector(".temperature__scale_f"),y=document.querySelector(".weather-description"),v=document.querySelector(".weather-icon"),S=document.querySelector(".wind__speed"),q=document.querySelector(".wind__direction"),w=document.querySelector(".background-image"),_=JSON.parse(localStorage.getItem("currentWeather")),T=JSON.parse(localStorage.getItem("flickrImages")),L=(new Date).getTime(),k=JSON.parse(localStorage.getItem("currentTempScale"))||"C";_?_.lastUpdate+6e4>L?(console.log("1 minute not left"),i(),r(),hideLoader()):(console.log("1 minute left"),e()):(console.log("It's first init"),e()),g.addEventListener("click",function(e){var t=e.target;"A"===t.tagName&&(e.preventDefault(),t.classList.contains("temperature__scale_c")?(k="C",c()):t.classList.contains("temperature__scale_f")?(k="F",c()):console.log("Error! What did you click?!?!?"))}),window.onunload=function(){localStorage.setItem("currentTempScale",JSON.stringify(k))}};weatherApp();