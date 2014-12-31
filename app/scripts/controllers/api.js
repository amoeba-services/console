'use strict';

/**
 * @ngdoc function
 * @name ampApp.controller:ApiCtrl
 * @description
 * # ApiCtrl
 * Controller of the ampApp
 */
angular.module('ampApp')
  .controller('ApiCtrl', function ($routeParams, $scope, Api, $mdToast) {
    $scope.api = $routeParams;
    $scope.api.path = decodeURIComponent($scope.api.path);

    $scope.saveApi = function(callback){
      if (typeof $scope.api !== 'undefined') {
        $scope.api.$save({
          namespace: $scope.api.namespace,
          path: $scope.api.path
        }, function(api) {
          $scope.api = api;
          $mdToast.show(
            $mdToast.simple()
              .content('API Saved')
              .position('bottom left')
          );
          if (typeof callback === 'function') {
            callback(api);
          }
        });
      }
      else {
        console.error('Save api failed: no api found.');
      }
    };

    Api.get({
      namespace: $scope.api.namespace,
      path: $scope.api.path
    }).$promise.then(
      function (api) {
        $scope.api = api;
        resetDescription();
      }
    );

    function resetDescription() {
      if (typeof $scope.api !== 'undefined'){
        $scope.description = angular.copy($scope.api.description);
      }
    }

    $scope.updateDescription = function() {
      if ($scope.description.length === 0) {
        resetDescription();
      }
      else {
        if ($scope.api.description !== $scope.description) {
          $scope.api.description = $scope.description;
          $scope.saveApi();
        }
      }
    };
  });
