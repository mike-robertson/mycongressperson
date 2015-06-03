'use strict';

angular.module('myCongresspersonApp')
  .directive('congressPersonPane', function () {
    return {
      templateUrl: '../directives/congressPersonPane/congressPersonPane.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });