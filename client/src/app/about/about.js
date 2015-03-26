(function() {
    'use strict';
    
    angular
        .module('app.about', [
            'ui.router',
            'ui.bootstrap',
            'placeholders'
        ])
        .config(configure)
        .controller('AboutController', AboutController);

    configure.$inject = ['$stateProvider'];
    AboutController.$inject = [];

	/**
	 * Routes for home module
	 */
    function configure($stateProvider) {
        $stateProvider.state( 'about', {
            url: '/about',
            views: {
                "main": {
                    controller: 'AboutController',
                    templateUrl: 'about/about.tpl.html'
                }
            },
            data: {pageTitle: 'About snapShare'}
        });
    }

    /**
     * About page controller 
     */
    function AboutController() {
        this.dropdownDemoItems = [
            'The first choice!',
            'And another choice for you.',
            'but wait! A third!'
        ];
    }

})();
