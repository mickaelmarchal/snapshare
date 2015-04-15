(function() {
  'use strict';

  angular
    .module('app.albums')
    .controller('ViewController', ViewController);

  ViewController.$inject = ['$stateParams'];

  /**
   * Album view controller
   */
  function ViewController($stateParams) {
    var albums = [
      {
        id: 1,
        title: 'Album 1',
        date: '2014-01-14'
      },
      {
        id: 2,
        title: 'Album 2',
        date: '2014-01-18'
      }
    ];

    /* TODO à remplacer avec underscore.js
    this.album = _.find(albums, function(album) { return album.id == $stateParams.id; });
    */
    for (var i = 0; i < albums.length; i++) {
      if (albums[i].id == $stateParams.id) {
        this.album = albums[i];
      }
    }
  }

})();
