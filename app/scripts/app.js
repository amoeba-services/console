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
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/apis/:namespace/:path', {
        templateUrl: 'views/api.html',
        controller: 'ApiCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
