'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('ISSOWDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // Application routes
        $stateProvider
            .state('login', {   
                url: '/login',
                templateUrl: 'templates/login.html'
            })
            .state('error', {
                url: '/error',
                templateUrl: 'templates/error.html'
            })
            .state('modifiable', {
                url: '/modifiable',
                templateUrl: 'templates/modifiable.html'                
            })
            .state('detail', {
                url: '/detail',
                templateUrl: 'templates/detail.html'
            })
            .state('source', {
                url: '/source',
                templateUrl: 'templates/source.html'
            })
            .state('released', {
                url: '/released',
                templateUrl: 'templates/released.html'
            });

        // For unmatched routes
        $urlRouterProvider.otherwise('/login');
    }
]);