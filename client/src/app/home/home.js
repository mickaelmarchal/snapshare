(function() {
    'use strict';
    
    angular
        .module('app.home', [
            'ui.router'
        ])
        .config(configure)
        .controller('HomeController', HomeController);

    configure.$inject = ['$stateProvider'];
    HomeController.$inject = [];

	/**
	 * Routes for home module
	 */
    function configure($stateProvider) {
        $stateProvider.state( 'home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeController',
                    templateUrl: 'home/home.tpl.html'
                }
            },
            data: {pageTitle: 'Home'}
        });
    }

    /**
     * Homepage controller 
     */
    function HomeController() {
        this.toto = 'aaaaa';
    }

})();