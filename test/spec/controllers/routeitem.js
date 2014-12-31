'use strict';

describe('Controller: RouteitemCtrl', function () {

  // load the controller's module
  beforeEach(module('ampApp'));

  var RouteitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RouteitemCtrl = $controller('RouteitemCtrl', {
      $scope: scope
    });
  }));

});
