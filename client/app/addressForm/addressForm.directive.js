'use strict';

angular.module('myCongresspersonApp')
  .directive('addressForm', function () {
    return {
      templateUrl: 'app/addressForm/addressForm.html',
      restrict: 'EA',
			scope: {
        ctrl: '=controller'
			},
      link: function (scope, element, attrs) {
      }
    };
  });