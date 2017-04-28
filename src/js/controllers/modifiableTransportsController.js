/**
 * Master Controller
 */

angular.module('ISSOWDash')
    .controller('modifiableTransportsController', ['$scope', '$cookieStore', 'Notification', '$sce', 'transportsService', modifiableTransportsController]);



function modifiableTransportsController($scope, $cookieStore, Notification, $sce, transportsService) {

    $scope.loading = true; 
    $scope.transports = []; 
    $scope.searchUsers = $cookieStore.get('transport-user'); //Get user from cookie store 

    $scope.editTask = {};
    $scope.developmentSystems = [];

    var selectedSystems = [];


    var users = _.words($scope.searchUsers); 

    $scope.systemFilter = function(value, index, array) {
        return _.find(selectedSystems, {"name":value.sysid});
    };

    $scope.$on('refresh', function(event, args) {
        load();    
    });

    $scope.filterOnSystem = function(system) {

        //Add or remove system from list of selected systems 
        if (_.find(selectedSystems, {"name":system.name})) { 
            _.pullAllBy(selectedSystems, [{"name":system.name}], 'name');
        } else {
            selectedSystems.push(system);
        }

    };

    $scope.getLastModified = function(transport)  {
        return transportsService.getLastModifiedDateAsText(transport.as4date + 'T' +  transport.as4time);
    };

    $scope.setEditTask = function(transport) {
        $scope.editTask = transport; 
    };

    $scope.setSelectedTask = function(transport) {
        transportsService.setSelectedTask(transport);
    };
    
    $scope.releaseTask = function(transport) {

        transportsService.releaseTask(transport).then(
            function(response) {
                console.log("POST success"); 
                Notification.success(response.message);
                transport.taskReleased = true; 
            }, 
            function(response) { // optional
                console.log("API POST error"); 
                Notification.success(response.message);                     
            }
        );
    };

    $scope.searchTransports = function() {
        $cookieStore.put('transport-user', $scope.searchUsers);    
        users = _.words($scope.searchUsers); 
        load();
    };
    

    
    $scope.updateTransport = function() {
       
        var transport = $scope.editTask; 

        transportsService.updateTransport(transport).then(
            function(response) {
                    console.log("POST success"); 
                    Notification.success(response.message);
                }, 
            function(response) { // optional
                    console.log("API POST error"); 
                    Notification.success(response.message);                     
                }
        );
    }; 

    $scope.getTransportTypeTooltip = function(transport) {

        switch(transport.taskType) {
            case 'W' :
                return 'Workbench';
            case 'C' : 
                return 'Customizing';
            case 'T' : 
                return 'Transport of Copies';
        }
    };

    var load = function() { 
        $scope.transports = [];
        $scope.loading = true;     
        transportsService.getDevelopmentSystems().then(
            function(response){
                $scope.developmentSystems = response;
                selectedSystems = $scope.developmentSystems.slice(0);
                for (var i = 0; i < $scope.developmentSystems.length; i++) {
                    transportsService.getTransportsForUsers($scope.developmentSystems[i].name, users).then(
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

