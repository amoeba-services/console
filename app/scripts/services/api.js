'use strict';

/**
 * @ngdoc service
 * @name awiApp.api
 * @description
 * # api
 * Factory in the awiApp.
 */
angular.module('awiApp')
  .factory('Api', function ($resource) {
    // Service logic

    // Public API here
    return $resource('//amoeba-api.herokuapp.com/apis/:namespace/:path');
  });
