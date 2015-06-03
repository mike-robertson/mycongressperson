'use strict';

// This is the service to get the geo coordinates. It is simple, it uses $q to use promises
angular.module('myCongresspersonApp')
	.factory('sunlightAPI', ['$q', '$http', function sunLightAPI($q, $http) {
		var apiKey = '3084917ca0a54b46b2c410c9ae0cbc5a';
		return {
			getReps: function(coordObj) {
				var latitude = coordObj.latitude;
				var longitude = coordObj.longitude;

			  var deferred = $q.defer();
			  var url = 'http://congress.api.sunlightfoundation.com/legislators/locate?latitude='+latitude+'&longitude='+longitude+'&apikey='+apiKey;
		    

		    deferred.notify('getting representatives and senators now...');

		    $http.get(url).success(function(repInfo) {
		    	console.log('success in the api');
		    	console.log(repInfo);
				  deferred.resolve(repInfo);
		    });
			  return deferred.promise;
			},
			getVotes: function(bioId, pageNumber, perPageNumber) {
				var deferred = $q.defer();
				var url = 'http://congress.api.sunlightfoundation.com/votes?voter_ids.'+
										bioId+'__exists=true&page='+pageNumber+'&apikey='+apiKey+
										'&fields=bill,voters,breakdown,result,roll_id&per_page='+perPageNumber+'&order=voted_at';

				deferred.notify('getting voting history for congressperson...');

				$http.get(url).success(function(votingRecord) {
					//console.log('success retreiving voting record');
					//console.log(votingRecord);
					deferred.resolve(votingRecord);
				});
				return deferred.promise;
			}
		};
	}]);