'use strict';

angular.module('myCongresspersonApp')
  .directive('congressPersonPane', function () {

    var controller = [function() {

    }];

    return {
      templateUrl: 'app/congressPersonPane/congressPersonPane.html',
      restrict: 'EA',
			scope: {
				congressPerson: '=info'
			},
      controller: controller
      // controllerAs: 'paneCtrl',
      // bindToController: true
    };
  });

//   'use strict';

// angular.module('myCongresspersonApp')
//   .directive('congressPersonPane', function () {
//     return {
//       templateUrl: 'app/congressPersonPane/congressPersonPane.html',
//       restrict: 'EA',
//       scope: {
//         congressPerson: '=info',
//         ctrl: '=controller'
//       },
//       link: function (scope, element, attrs) {
//       }
//     };
//   });