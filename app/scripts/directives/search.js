'use strict';

/**
 * @ngdoc directive
 * @name awiApp.directive:search
 * @description
 * # search
 */
angular.module('awiApp')
  .directive('search', ['$http', function ($http) {
    var SUGGEST_MAX_AMOUNT = 5;

    return {
      templateUrl: '/views/search.html',
      restrict: 'E',
      scope: {
        initPath: '@path',
        initNamespace: '@namespace'
      },
      link: function postLink(scope) {
        var timeout;
        scope.api = {
          path: scope.initPath,
          namespace: scope.initNamespace
        };
        console.log(scope);
        scope.namespaces = ['playground', 'pc'];
        scope.search = function() {
          if (timeout) {
            clearTimeout(timeout);
          }
          if (scope.api.path.length === 0) {
            scope.matchedApis = [];
            return;
          }
          timeout = setTimeout(function () {
            var query = encodeURIComponent(scope.api.path);
            if (scope.api.namespace === null) {
              query += '+namespace:' + scope.api.namespace;
            }
            var url = '//amoeba-api.herokuapp.com/apis?q=' + query + '&amount=' + SUGGEST_MAX_AMOUNT;
            $http.get(url).success(function (data) {
              scope.matchedApis = data;
              scope.selectedIndex = -1;
            });
          }, 400);
        };
        scope.getHref = function(api) {
          return '#/apis/' + encodeURIComponent(api.namespace) + '/' + encodeURIComponent(encodeURIComponent(api.path));
        };
      }
    };
  }]);
