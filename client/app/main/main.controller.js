'use strict';

angular.module('myCongresspersonApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'Auth', 'geoService', 'sunlightAPI', 'uiGmapGoogleMapApi', 
    function ($scope, $http, socket, Auth, geoService, sunlightAPI, GoogleMapApi) {
      var ctrl = this;

      ctrl.loading = true;

      ctrl.address = {
        streetNo: '',
        streetName: '',
        city: '',
        state: ''    
      };

      ctrl.showVoteInfo = false;

      // Bind the Auth functions to scope so it is easy to access in our html.
      ctrl.isAdmin = Auth.isAdmin;
      ctrl.isLoggedIn = Auth.isLoggedIn;

      // Get the promise from the geoService which retreives coords.
      // TODO: add some error handling, such as making user input their address.
      var promise = geoService.getCoords();

      ctrl.coordObj = '';
      promise.then(function(coords) {
        ctrl.coordObj = coords;
        console.log(ctrl.coordObj);
      }, function(reason) {
        console.log('Failed: ' + reason);
        //handle the error here somehow, maybe pop up to make user enter their address
      }, function(update) {
        console.log('Update: ' + update);
      });

      // Get the promise from the sunlightAPI service which retreives reps.
      // TODO: add some error handling.
      var promiseSunlight = promise.then(function(){
        var promiseAPI = sunlightAPI.getReps(ctrl.coordObj);

        promiseAPI.then(function(reps) {
          ctrl.repInfo = reps;
          ctrl.repArray = reps.results;
          ctrl.loading = false;
        }, function(reason) {
          console.log('Failed: ' + reason);
          ctrl.loading = false;
          //handle the error here somehow, maybe pop up to make user enter their address
        }, function(update) {
          console.log('Update: ' + update);
        });
      });

      ctrl.setState = function(newState) {
        ctrl.address.state = newState;
      };

      var stringifyAddress = function() {
        return ctrl.address.streetNo + ' ' + ctrl.address.streetName + ', ' + ctrl.address.city + ', ' + ctrl.address.state;
      };

      var addressIsFilledOut = function() {
        return (ctrl.address.streetNo !== '' || ctrl.address.streetName !== '' || 
          ctrl.address.city !== '' || ctrl.address.state !== '') ? true : false;
      };

      ctrl.updateLocation = function() {
        if(addressIsFilledOut()) {
          GoogleMapApi.then(function(maps) {
            var geocoder = new maps.Geocoder();
            geocoder.geocode({ 'address': stringifyAddress() }, function(results, status) {
              if (status === maps.GeocoderStatus.OK) {
                ctrl.coordObj = {
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng()
                };
                console.log(ctrl.coordObj);
                ctrl.loading = true;
                ctrl.repArray = [];
                var promiseUpdate = sunlightAPI.getReps(ctrl.coordObj);

                promiseUpdate.then(function(reps) {
                  console.log('fulfilled promise');
                  ctrl.repInfo = reps;
                  console.log(ctrl.repInfo);
                  ctrl.repArray = reps.results;
                  ctrl.loading = false;
                }, function(reason) {
                  console.log('Failed: ' + reason);
                  ctrl.loading = false;
                  //handle the error here somehow, maybe pop up to make user enter their address
                }, function(update) {
                  console.log('Update: ' + update);
                });
              }
            });
          });
        }
      };

      ctrl.getVotingRecord = function(repId) {
         var promiseUpdate = sunlightAPI.getVotes(repId);
            promiseUpdate.then(function(votes) {
              console.log('fulfilled promise');
              ctrl.voteInfo = votes;
              console.log(ctrl.voteInfo);
              ctrl.repArray = reps.results;
              ctrl.loading = false;
            }, function(reason) {
              console.log('Failed: ' + reason);
              ctrl.loading = false;
              //handle the error here somehow, maybe pop up to make user enter their address
            }, function(update) {
              console.log('Update: ' + update);
            });
      };

      ctrl.toggleVoteInfo = function() {
        ctrl.showVoteInfo = !ctrl.showVoteInfo;
      };

      ctrl.blurElement = function($event) {
        var target = $event.target;
        target.blur();
      };

      ctrl.states = [      
        'Alabama',      'Alaska',      'Arizona',      'Arkansas',
        'California',      'Colorado',      'Connecticut',      'Delaware',
        'Florida',      'Georgia',      'Hawaii',      'Idaho',
        'Illinois',      'Indiana',      'Iowa',      'Kansas',
        'Kentucky',      'Louisiana',      'Maine',      'Maryland',
        'Massachusetts',      'Michigan',      'Minnesota',      'Mississippi',
        'Missouri',      'Montana',      'Nebraska',      'Nevada',
        'New Hampshire',      'New Jersey',      'New Mexico',      'New York',
        'North Carolina',      'North Dakota',      'Ohio',      'Oklahoma',
        'Oregon',      'Pennsylvania',      'Rhode Island',      'South Carolina',
        'South Dakota',      'Tennessee',      'Texas',      'Utah',
        'Vermont',      'Virginia',      'Washington',      'West Virginia',
        'Wisconsin',      'Wyoming'
      ];

  }]);
