(function() {
    'use strict';
    
    angular
        .module('app.albums')
        .controller('ListController', ListController);

    ListController.$inject = [];

    /**
     * Albums list controller 
     */
    function ListController() {
        this.albums = [
            {
                id: 1,
                title: 'Album 1',
                date: '2014-01-14'
            },
            {
                id: 2,
                title: 'Album 2',
                date: '2014-01-18'
            },
            {
                id: 3,
                title: 'Album 3',
                date: '2014-02-18'
            },
            {
                id: 4,
                title: 'Album 4gfhhgfh',
                date: '2014-02-18'
            }

        ];
    }

})();