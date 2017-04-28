/**
 * Widget Header Directive
 */

angular
    .module('ISSOWDash')
    .directive('loggedInSystems', loggedInSystems);

function loggedInSystems() {
    var directive = {
        template: '<span ng-repeat="system in systems" class="badge">{{system.name}}&nbsp</span>',
        restrict: 'E'
    };

    return directive;
}