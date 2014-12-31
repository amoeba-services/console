'use strict';

/**
 * @ngdoc directive
 * @name ampApp.directive:loading
 * @description
 * # loading
 */
angular.module('ampApp')
  .directive('loading', function () {
    return {
      template: '<md-progress-circular md-mode="indeterminate" ng-show="show"></md-progress-circular>',
      restrict: 'E',
      link: function ($scope) {
        $scope.show = true;
        $scope.$on("loading_show", function () {
          $scope.show = true;
        });
        $scope.$on("loading_hide", function () {
          $scope.show = false;
        });
      }
    };
  });
