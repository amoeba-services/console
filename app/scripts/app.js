'use strict';

/**
 * @ngdoc overview
 * @name awiApp
 * @description
 * # awiApp
 *
 * Main module of the application.
 */
angular
  .module('awiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize'
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
