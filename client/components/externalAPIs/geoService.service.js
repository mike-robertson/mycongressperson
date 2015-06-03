'use strict';

// This is the service to get the geo coordinates. It is simple, it uses $q to use promises
angular.module('myCongresspersonApp')
	.factory('geoService', ['$q', function geoService($q) {

		return {
			getCoords: function() {
			  var deferred = $q.defer();
		    deferred.notify('getting coordinates now...');

		    if ('geolocation' in navigator) {

	      	navigator.geolocation.getCurrentPosition(function(position) {
	      		var coordObj = {
	      			latitude: position.coords.latitude,
	      			longitude: position.coords.longitude
	      		};

				  	deferred.resolve(coordObj);
	      	});
		    } else {
		      deferred.reject('Unable to get the coordinates. The action timed out or the user denied the request');
		    }
			  return deferred.promise;
			}
		};
	}]);