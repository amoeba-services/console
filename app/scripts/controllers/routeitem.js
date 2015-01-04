'use strict';

/**
 * @ngdoc function
 * @name ampApp.controller:RouteitemCtrl
 * @description
 * # RouteitemCtrl
 * Controller of the ampApp
 */

/* global JSONFormat */
/* jshint newcap: false */

angular.module('ampApp')
  .controller('RouteitemCtrl', function ($scope) {
    $scope.HTTP_STATUS_CODE = {
      '100': 'Continue',
      '101': 'Switching Protocols',
      '102': 'Processing',
      '200': 'OK',
      '201': 'Created',
      '202': 'Accepted',
      '203': 'Non-Authoritative Information',
      '204': 'No Content',
      '205': 'Reset Content',
      '206': 'Partial Content',
      '207': 'Multi-Status',
      '208': 'Already Reported',
      '226': 'IM Used',
      '300': 'Multiple Choices',
      '301': 'Moved Permanently',
      '302': 'Found',
      '303': 'See Other',
      '304': 'Not Modified',
      '305': 'Use Proxy',
      '306': '(Unused)',
      '307': 'Temporary Redirect',
      '308': 'Permanent Redirect',
      '400': 'Bad Request',
      '401': 'Unauthorized',
      '402': 'Payment Required',
      '403': 'Forbidden',
      '404': 'Not Found',
      '405': 'Method Not Allowed',
      '406': 'Not Acceptable',
      '407': 'Proxy Authentication Required',
      '408': 'Request Timeout',
      '409': 'Conflict',
      '410': 'Gone',
      '411': 'Length Required',
      '412': 'Precondition Failed',
      '413': 'Payload Too Large',
      '414': 'URI Too Long',
      '415': 'Unsupported Media Type',
      '416': 'Range Not Satisfiable',
      '417': 'Expectation Failed',
      '418': 'I\'m a teapot',
      '422': 'Unprocessable Entity',
      '423': 'Locked',
      '424': 'Failed Dependency',
      '425': 'Unordered Collection',
      '426': 'Upgrade Required',
      '428': 'Precondition Required',
      '429': 'Too Many Requests',
      '431': 'Request Header Fields Too Large',
      '451': 'Unable For Legal Reasons',
      '500': 'Internal Server Error',
      '501': 'Not Implemented',
      '502': 'Bad Gateway',
      '503': 'Service Unavailable',
      '504': 'Gateway Timeout',
      '505': 'HTTP Version Not Supported',
      '506': 'Variant Also Negotiates',
      '507': 'Insufficient Storage',
      '508': 'Loop Detected',
      '509': 'Bandwidth Limit Exceeded',
      '510': 'Not Extended',
      '511': 'Network Authentication Required'
    };
    $scope.modes = {
      'json': 'javascript',
      'text': 'text',
      'html': 'html',
      'xml': 'xml'
    };

    $scope.editMode = false;
    $scope.edit = function() {
      $scope.editMode = true;
    };

  })
  .controller('RouteitemInfoCtrl', function($scope) {
    $scope.$watch(
      function() {
        if ($scope.api && $scope.api.route) {
          return $scope.api.route[0];
        }
      },
      function(newValue) {
        $scope.routeItem = angular.copy(newValue);
        //TODO: 此处应显示继承后的结果
        if (newValue && newValue.response && newValue.response.content) {
          var content = $scope.routeItem.response.content;
          if (content.status === undefined) {
            content.status = '200';
          }
          if (content.type === undefined) {
            content.type = 'json';
          }
          if (content.type === 'json') {
            content.body = JSONFormat(JSON.stringify(content.body));
          }
          $scope.editorOptions.mode = $scope.modes[content.type];
        }
      }
    );
    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      tabSize: 2,
      readOnly: 'nocursor',
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    };
  })
  .controller('RouteitemEditCtrl', function($scope, $timeout) {
    var defaultHeader = {
      key: '',
      value: ''
    };
    function setScopedItem(value){
      delete $scope.error;
      $scope.item = angular.copy(value);
      if (value && value.response && value.response.content) {
        var content = $scope.item.response.content;
        if (typeof content.type === 'undefined') {
          content.type = 'json';
        }
        if (content.type === 'json') {
          content.body = JSONFormat(JSON.stringify(content.body));
        }
        if (typeof content.status === 'undefined') {
          content.status = '200';
        }
        if (!_.isArray(content.headers)) {
          content.headers = [angular.copy(defaultHeader)];
        }
      }
    }

    $scope.cancel = function() {
      $scope.$parent.editMode = false;
      // timeout 解决动画卡顿问题
      $timeout(function(){
        setScopedItem($scope.api.route[0]);
      }, 400);
    };

    $scope.mode = 'json';

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      tabSize: 2,
      mode: $scope.modes[$scope.mode],
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    };
    $scope.$watch('mode', function(newValue) {
      $scope.editorOptions.mode = $scope.modes[newValue];
    });

    $scope.$watch(
      function() {
        if ($scope.api && $scope.api.route) {
          return $scope.api.route[0];
        }
      },
      function(newValue) {
        setScopedItem(newValue);
      }
    );

    $scope.$watch('item.response.content.headers.length', function(newValue) {
      if (typeof $scope.item === 'undefined') {
        return;
      }
      if (newValue === 0) {
          $scope.item.response.content.headers.push(angular.copy(defaultHeader));
      }
    });

    function validate(item) {
      var error = {};
      if (item.response.content.type === 'json'){
        try {
          JSON.parse(item.response.content.body);
        }
        catch (e) {
          error.JSON_INVALID = true;
        }
      }
      return error;
    }
    function standardize(routeItem) {
      var item = angular.copy(routeItem);
      var content = item.response.content;
      if (content.headers) {
        content.headers = _(content.headers).filter(function(header) {
          return header.key.length || header.value.length;
        }).value();
      }
      if (content.type === 'json'){
        content.body = JSON.parse(content.body);
      }
      return item;
    }
    $scope.save = function() {
      $scope.error = validate($scope.item);
      if (_.isEmpty($scope.error)) {
        $scope.api.route[0] = standardize($scope.item);
        $scope.saveApi($scope.cancel);
      }
    };
  });