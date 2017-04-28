/**
 * Widget Header Directive
 */

angular
    .module('ISSOWDash')
    .directive('rdWidgetHeader', rdWidgetTitle);

function rdWidgetTitle() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            loading: '=',
            status:'='
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div ><div class="pull-left"><i class="fa widget-icon-small" ng-class="getIconClass()"></i> {{title}} </div><div class="pull-right"><ng-transclude></ng-transclude></div></div></div></div>',
        restrict: 'E',
        link: function(scope) {

            scope.getIconClass = function() {

                var icon = ""; 

                if (scope.loading) {
                    icon = "fa-cog fa-spin"
                } else {
                    icon = "fa-tasks"
                }; 

                switch (scope.status) {
                    case "error": 
                        return icon + " red";
                        break; 
                    case "success": 
                        return icon + " green";
                        break;      
                    case undefined: 
                        return icon + " blue";
                        break;      
                };
            }; 
        }
    };
    return directive;
};