'use strict';

/**
 * @ngdoc overview
 * @name ampApp
 * @description
 * # ampApp
 *
 * Main module of the application.
 */
angular
  .module('ampApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ui.tree',
    'ui.codemirror'
  ])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')

      .primaryColor('light-green')
      //.accentColor('light-blue')
      //.warnColor('pink')
      ;
    $mdThemingProvider.alwaysWatchTheme(true);
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/apis/:namespace/:path', {
        templateUrl: 'views/api.html',
        controller: 'ApiCtrl',
        title: function(params) {
          return decodeURIComponent(params.path) + ' | ' + decodeURIComponent(params.namespace);
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('httpInterceptor', function ($q, $rootScope) {

    var numLoadings = 0;

    return {
      request: function (config) {

        numLoadings++;

        $rootScope.$broadcast("loading_show");
        return config || $q.when(config)

      },
      response: function (response) {

        if ((--numLoadings) === 0) {
          $rootScope.$broadcast("loading_hide");
        }

        return response || $q.when(response);

      },
      responseError: function (response) {

        if (!(--numLoadings)) {
          $rootScope.$broadcast("loading_hide");
        }

        return $q.reject(response);
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  })
  .run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
      if (typeof current.$$route.title === 'function') {
        $rootScope.title = current.$$route.title(current.params);
      }
      else {
        $rootScope.title = current.$$route.title;
      }
      if ($rootScope.title) {
        $rootScope.title += ' | Amoeba';
      }
      else {
        $rootScope.title = 'Amoeba';
      }
    });
  }]);
