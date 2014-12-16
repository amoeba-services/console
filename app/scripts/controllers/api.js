'use strict';

/**
 * @ngdoc function
 * @name awiApp.controller:ApiCtrl
 * @description
 * # ApiCtrl
 * Controller of the awiApp
 */
angular.module('awiApp')
  .controller('ApiCtrl', function ($routeParams, $scope, Api) {
    $scope.api = $routeParams;
    $scope.api.path = decodeURIComponent($scope.api.path);

    Api.get({
      namespace: $scope.api.namespace,
      path: $scope.api.path
    }).$promise.then(
      function (api) {
        $scope.api = api;
      }
    );
  });
