'use strict';

/**
 * @ngdoc service
 * @name ampApp.api
 * @description
 * # api
 * Factory in the ampApp.
 */
angular.module('ampApp')
  .factory('Api', function ($resource) {
    // Service logic

    // Public API here
    return $resource('//amoeba-api.herokuapp.com/apis/:namespace/:path');
  });
