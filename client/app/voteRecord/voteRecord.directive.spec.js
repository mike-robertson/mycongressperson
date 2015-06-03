'use strict';

describe('Directive: voteRecord', function () {

  // load the directive's module and view
  beforeEach(module('myCongresspersonApp'));
  beforeEach(module('app/voteRecord/voteRecord.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<vote-record></vote-record>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the voteRecord directive');
  }));
});