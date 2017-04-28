angular.module('ISSOWDash', ['ui.router', 'ngCookies', 'ui-notification', 'ngSanitize', 'hc.marked', 'ngAnimate', 'base64', 'ngFileSaver', 'ui.bootstrap'])
.config(['NotificationProvider', function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 50,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });

         
    }])
.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);