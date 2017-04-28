/**
 * Master Controller
 */

angular.module('ISSOWDash')
    .controller('releasedTransportsController', ['$scope', '$cookieStore', 'transportsService', releasedTransportsController]);
    

function releasedTransportsController($scope, $cookieStore, transportsService) {

    var selectedSystems = []; 

    $scope.loading = true; 
    $scope.transports = [];
    $scope.transportsSinceXDays = 7;

    var filterOn = false; 
    var activeButton = [false, true, false, false, false];


    $scope.getLastModified = function(transport)  {
        return transportsService.getLastModifiedDateAsText(transport.as4date);
    };


    $scope.setSelectedTask = function(transport) {
        transportsService.setSelectedTask(transport);
    };
    

    var setActive = function(index) {

        for (var i = 0; i < activeButton.length; i++) {
            activeButton[i] = false; 
        }

        activeButton[index] = true;
    };

    $scope.updateListSince = function(days, index) {
        $scope.transportsSinceXDays = days;
        setActive(index);
        load();

    };

    $scope.$on('refresh', function(event, args) {
        load();    
    });

    $scope.setCustomFilter = function() {
        filterOn = !filterOn; 
        $scope.customFilter = filterNotInProduction; 
    };

    $scope.isActive = function(index) {
        if (activeButton[index]) {
            return 'active';
        } else {
            return '';
        }
    }; 

    var filterNotInProduction = function(value, index, array) {
        if (filterOn) {
            return !_.find(value.systems, function(system) {
                return system.systemid === "PRD";
            });
        } else {
            return true;
        }
    }; 

    $scope.customFilter = function(value, index, array) {
        return true;
    };

    // var load = function() { 
    //     $scope.loading = true; 

    //     transportsService.getReleasedTransportsSince($scope.transportsSinceXDays).then(function(response){
    //         $scope.transports = response;
    //         $scope.loading = false; 
    //     }, function(){
    //         console.log('API fetch error');
    //     });

    // };

    var load = function() { 
        $scope.transports = [];
        $scope.loading = true;     
        transportsService.getDevelopmentSystems().then(
            function(response){
                $scope.developmentSystems = response;
                selectedSystems = $scope.developmentSystems.slice(0);
                for (var i = 0; i < $scope.developmentSystems.length; i++) {
                    transportsService.getReleasedTransportsSince($scope.developmentSystems[i].name, $scope.transportsSinceXDays).then(
                    function(response){
                        $scope.transports = $scope.transports.concat(response);
                        $scope.loading = false; 
                    },
                    function(){
                        console.log('API fetch error');
                    });     
                }
            }, 
            function(){
                console.log('API fetch error');
            });
    };


    load();
}



