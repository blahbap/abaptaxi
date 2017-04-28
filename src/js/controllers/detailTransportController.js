/**
 * Master Controller
 */

angular.module('ISSOWDash')
    .controller('detailTransportsController', ['$scope', '$cookieStore', 'transportsService', 'FileSaver', detailTransportsController]);

function detailTransportsController($scope, $cookieStore, transportsService, FileSaver) {

    $scope.selectedTask = transportsService.getSelectedTask();
    $scope.selectedObject = {};
    $scope.objects = []; 
    
    $scope.taskName = transportsService.getSelectedTask().trkorr || $cookieStore.get('transport-selected');

    $scope.saveSource = function(system, object) {
        
        $scope.selectedObject = object;
        //Check object type 
        var url = object.adtRelUrl + '?sapsystem=' + system;

        transportsService.getSourceForObjectAtUrl(url).then(function(response) {            
            //Create BLOB for downloading source 
            var blob = new Blob([ response ], { type : 'text/plain' });
            FileSaver.saveAs(blob, _.trim(system + '-' + object.objName.substr(0, 30)) + '.abp');
        }, function(){
                console.log('Unable to fetch source for object');
        });

    };

   

    $scope.$watch("taskName",
        function handleChange( newValue, oldValue ) {
            if (newValue) {
                $cookieStore.put('transport-selected', newValue);    
                transportsService.getTransport(newValue).then(
                    function(task) {
                        $scope.selectedTask = task; 
                    },
                    function() {
                        console.log("API Error");
                    }

                );
            }
        
        }
    );



}
