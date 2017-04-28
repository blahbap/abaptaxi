/**
 * Alerts Controller
 */

angular
    .module('ISSOWDash')
    .controller('AlertsCtrl', ['$scope', '$http', AlertsCtrl]);

function AlertsCtrl($scope, $http) {

    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.alerts = [];

    
}