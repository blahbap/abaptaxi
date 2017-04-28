/**
 * Widget Directive
 */

angular
    .module('ISSOWDash')
    .directive('iswCheckIcon', iswCheckIcon);

function iswCheckIcon() {
    var directive = {
        template: '<div>Hello</div>',
        restrict: 'EA',
        link:link
    };

    function link(scope, element, attrs) {
        /* */
        console.log("Check =" + attrs.check);
        console.log("Scope + " + scope.dashboard.ads.status);
    }
    
    return directive;
};