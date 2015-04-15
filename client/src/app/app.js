(function() {
  'use strict';

  angular
    .module('app', [
      'templates-app',
      'templates-common',
      'app.home',
      'app.about',
      'app.albums',
      'ui.router'
    ])
    .config(configure)
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', '$location'];

  /* TODO ne passe pas les unit tests
  configure.$inject = ['$stateProvider', '$urlRouteProvider'];*/

  /**
   * Default router config
   */
  function configure($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }

  /**
   * Main controller for app
   */
  function AppController($scope, $location) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = toState.data.pageTitle + ' | snapShare' ;
      }
    });
  }

})();
