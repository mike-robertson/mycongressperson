'use strict';

describe('Directive: congressPersonPane', function () {

  // load the directive's module and view
  beforeEach(module('myCongresspersonApp'));
  beforeEach(module('app/congressPersonPane/congressPersonPane.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<congress-person-pane></congress-person-pane>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the congressPersonPane directive');
  }));
});