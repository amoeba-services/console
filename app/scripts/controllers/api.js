'use strict';

/**
 * @ngdoc function
 * @name ampApp.controller:ApiCtrl
 * @description
 * # ApiCtrl
 * Controller of the ampApp
 */

var API_DEFAULT_TEMPLATE = {
  route : [
    {
      description : 'Default Response',
      response : {
        content : {
          status : '200',
          type : 'json',
          body : '{}'
        },
        inherited : false
      }
    }
  ],
  disabled : false
};

angular.module('ampApp')
  .controller('ApiCtrl', function ($routeParams, $scope, Api, $mdToast, $mdDialog) {
    $scope.api = $routeParams;
    $scope.api.path = decodeURIComponent($scope.api.path);

    $scope.namespaces = ['playground', 'pc', 'mis'];

    $scope.editMode = false;
    $scope.setEditMode = function(mode) {
      $scope.editMode = mode;
    };

    $scope.saveApi = function(callback){
      if (typeof $scope.api !== 'undefined') {
        $scope.api.$save({
          namespace: $scope.api.namespace,
          path: $scope.api.path
        }, function(api) {
          $scope.api = api;
          var toast = $mdToast.simple()
              .content('API Saved')
              .position('top right');
          toast._options.parent = '.api-info';//hack, see https://github.com/angular/material/issues/1067
          $mdToast.show(toast);
          if (typeof callback === 'function') {
            callback(api);
          }
        });
      }
      else {
        console.error('Save api failed: no api found.');
      }
    };

    $scope.showCreateApiDialog = function (event) {
      $mdDialog.show({
        controller: 'CreateApiDialogController',
        templateUrl: 'views/createapidialog.html',
        targetEvent: event,
        locals: {
          api: $scope.api,
          namespaces: $scope.namespaces
        },
        bindToController: true,
        parent: '.error-info'
      })
      .then(function(api) {
        $scope.api = api;
        delete $scope.error;
      });
    };

    Api.get({
      namespace: $scope.api.namespace,
      path: $scope.api.path
    }).$promise.then(
      function (api) {
        $scope.api = api;
      },
      function (error) {
        console.log(error);
        switch (error.status) {
          case 404:
                error.message = 'API not exists';
                $scope.showCreateApiDialog();
                break;
          default :
                error.message = error.data || 'Something is wrong with Amoeba API Service';
        }
        $scope.error = error;
      }
    );

    var descriptionCache;
    $scope.cacheDescription = function() {
      descriptionCache = $scope.api.description;
    };
    $scope.updateDescription = function(apiDescForm) {
      if (apiDescForm.description.$error.required) {
        $scope.api.description = descriptionCache;
      }else {
        if ($scope.api.description !== descriptionCache) {
          $scope.saveApi();
        }
      }
    };
  })
  .controller('CreateApiDialogController', function ($scope, $mdDialog, Api, $location, api, namespaces) {
    $scope.api = api;
    $scope.namespaces = namespaces;
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submit = function(createApiForm) {
      if (!createApiForm.$valid) {
        return;
      }
      var api = angular.copy(API_DEFAULT_TEMPLATE);
      _.extend(api, $scope.api);
      Api.create(api).$promise.then(
        function (api) {
          $location
            .url('/apis/' + api.namespace + '/' + encodeURIComponent(encodeURIComponent(api.path)))
            .replace();
          $mdDialog.hide(api);
        },
        function (error) {
          console.log(error);
          $mdDialog.hide();
        }
      );
    };
  });
