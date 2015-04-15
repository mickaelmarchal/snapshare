(function() {
  'use strict';

  angular
    .module('app.albums', [
      'ui.router'
    ])
    .config(configure);

  configure.$inject = ['$stateProvider'];

  /**
   * Routes for module
   */
  function configure($stateProvider) {
    $stateProvider

      // TODO comment faire pour mettre albums.list ?
      .state('albums_list', {
        url: '/albums',
        views: {
          main: {
            controller: 'ListController',
            templateUrl: 'albums/list/list.tpl.html'
          }
        },
        data: {pageTitle: 'Albums'}
      })
      .state('albums_view', {
        url: '/albums/view/:id',
        views: {
          main: {
            controller: 'ViewController',
            templateUrl: 'albums/view/view.tpl.html'
          }
        },
        data: {pageTitle: 'View album'}
      });

  }

})();
