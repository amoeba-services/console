'use strict';

/**
 * @ngdoc function
 * @name ampApp.controller:ApiCtrl
 * @description
 * # ApiCtrl
 * Controller of the ampApp
 */
angular.module('ampApp')
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
