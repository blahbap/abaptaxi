angular
    .module('ISSOWDash')
    .directive('rdWidgetTab', rdWidgetTab);

function rdWidgetTab($compile) {
    var directive = {
        // require: '^rdWidgetHeader',
        scope: {},
        transclude: true,
        template: '<div class="pull-right col-xs-6 col-sm-4" ng-transclude></div>',
        restrict: 'E',
        link: function(scope, element, attrs, headerCtrl) {
        }
    };
    return directive;
};