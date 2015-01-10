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
    return $resource('//api.amoeba.services/apis/:namespace/:path', {}, {
      'create': {method: 'POST'},
      'save': {method:'PUT'}
    });
  });
