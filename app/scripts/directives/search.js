'use strict';

/**
 * @ngdoc directive
 * @name ampApp.directive:search
 * @description
 * # search
 */
angular.module('ampApp')
  .directive('search', ['$http', '$location', function ($http, $location) {
    var SUGGEST_MAX_AMOUNT = 5;

    return {
      templateUrl: '/views/directives/search.html',
      restrict: 'E',
      replace: true,
      scope: {
        initPath: '@path',
        initNamespace: '@namespace'
      },
      link: function postLink(scope) {
        var timeout;

        scope.getHref = function(api) {
          return '/apis/' + encodeURIComponent(api.namespace) + '/' + encodeURIComponent(encodeURIComponent(api.path));
        };
        scope.initApi = function() {
          scope.api = {
            path: scope.initPath,
            namespace: scope.initNamespace
          };
          scope.activeIndex = -1;
        };
        scope.activate = function() {
          scope.active = true;
        };
        scope.deactivate = function() {
          scope.active = false;
          scope.initApi();
        };
        scope.activateResultItem = function(index) {
          scope.activeIndex = index;
        };

        scope.initApi();
        scope.namespaces = ['playground', 'pc'];
        scope.search = function() {
          if (timeout) {
            clearTimeout(timeout);
          }
          if (scope.api.path.length === 0) {
            scope.matchedApis = [];
            return;
          }
          var api = _.extend({}, scope.api);
          timeout = setTimeout(function () {
            var query = encodeURIComponent(api.path);
            if (scope.api.namespace !== null) {
              query += '+namespace:' + api.namespace;
            }
            var url = '//amoeba-api.herokuapp.com/apis?q=' + query + '&amount=' + SUGGEST_MAX_AMOUNT;
            $http.get(url).success(function (data) {
              if (api.namespace === null) {
                api.mode = 'disabled';
                data.push(api);
              }
              else {
                var apiExists = !!_(data).find({
                  path: api.path,
                  namespace: api.namespace
                });
                if (!apiExists) {
                  api.mode = 'add';
                  data.push(api);
                }
              }
              scope.matchedApis = data;
              scope.activeIndex = -1;
            });
          }, 400);
        };
        scope.checkKeyDown = function(event) {
          if (scope.matchedApis) {
            var offset = 0;
            if (event.keyCode === 40) { //down
              offset = 1;
            }
            else if (event.keyCode === 38) { //up
              offset = -1;
            }
            if (offset !== 0) {
              event.preventDefault();
              var apiLength = scope.matchedApis.length;
              do {
                scope.activeIndex = (scope.activeIndex + apiLength + 2 + offset) % (apiLength + 1) - 1;
              }
              while (
                scope.activeIndex !== -1 &&
                scope.matchedApis[scope.activeIndex].mode === 'disabled'
                );
              return;
            }
          }
          if(event.keyCode===13) { //enter
            var url, matchedApi = scope.matchedApis[scope.activeIndex];
            if (matchedApi) {
              url = scope.getHref(matchedApi);
              $location.url(url);
            }
            return;
          }
          if (event.keyCode === 27) { //esc
            scope.deactivate();
            event.target.blur();
            return;
          }
        };
      }
    };
  }]);
