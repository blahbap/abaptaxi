/**
 * Source Controller
 */

angular
    .module('ISSOWDash')
    .controller('sourceController', ['$scope', '$http', 'transportsService', 'FileSaver', 'Notification', SourceCtrl]);

function SourceCtrl($scope, $http, transportsService, FileSaver, Notification) {

    $scope.isLoading = false; 

    var objectTypes = {
        report: 1, 
        class: 2, 
        wdComponent: 3, 
        wdView: 4

    };

    // Search for and return ibjects matching the the string from the input field 
    $scope.getObjects = function(val, objectType) {

        var adtUrl  = ""; 

        switch (objectType) {
            case 'report': 
                url = '/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=' + val + '&maxResults=30&objectType=PROG&sapsystem=' + $scope.selection.selectedSystem.name;
                break;
            case 'class': 
                url = '/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=' + val + '&maxResults=30&objectType=CLAS&sapsystem=' + $scope.selection.selectedSystem.name;
                break; 
            case 'wdComponent': 
                url = '/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=' + val + '&maxResults=30&objectType=WDYN&sapsystem=' + $scope.selection.selectedSystem.name;
                break; 
            }

        return $http.get(url).
        then(function(response){            

            // Parse XML using jQuery to get all the object names
            $scope.reports = [];
            var xmlDoc = $.parseXML(response.data);
            var $xml = $(xmlDoc);
            $reports = $xml.find("objectReference");
            for (var i = $reports.length - 1; i >= 0; i--) {
                var $report = $($reports[i]);
                $scope.reports.push($report.attr('adtcore:name'));
            }
            
            return $scope.reports;
        });
    };

    $scope.selection  = {        
       options:   [
          {id: '1', name: 'Report'},
          {id: '2', name: 'Class'},
          {id: '3', name: 'Web Dynpro Component'},
          {id: '4', name: 'Web Dynpro View'}
        ],
        selectedOption: {id: '1', name: 'Report'}, 
        selectedSystem: {name: $scope.systems[0].name, url:$scope.systems[0].url},
        report:"",
        class:"", 
        wdComponent:"", 
        wdView:""
    };
    

    //  Download source for object to the browser "Downloads" folder 
    $scope.saveSource = function() {
        
        $scope.isLoading = true; 
        var adtUrl = ""; 
        var objectName = ""; 
        
        switch ($scope.selection.selectedOption.id) {
            case '1': 
                adtUrl = '/sap/bc/adt/programs/programs/' + $scope.selection.report + '/source/main';
                objectName = $scope.selection.report; 
                break;            
            case '2': 
                adtUrl = '/sap/bc/adt/oo/classes/' + $scope.selection.class + '/source/main';
                objectName = $scope.selection.class; 
                break;
            case '3': 
                adtUrl = '/sap/bc/adt/wdy/componentcontrollers/' + $scope.selection.wdComponent + '/componentcontroller/source';
                objectName = $scope.selection.wdComponent; 
                break;
            case '4': 
                adtUrl = '/sap/bc/adt/wdy/views/' + $scope.selection.wdComponent + '/' + $scope.selection.wdView + '/source';
                objectName = $scope.selection.wdComponent + '-' + $scope.selection.wdView; 
                break;

        }

        $scope.selectedObject = object;
        //Check object type 
        var url = adtUrl + '?sapsystem=' + $scope.selection.selectedSystem.name;

        transportsService.getSourceForObjectAtUrl(url).then(function(response) {            
            //Create BLOB for downloading source 
            var blob = new Blob([ response ], { type : 'text/plain' });
            FileSaver.saveAs(blob, _.trim($scope.selection.selectedSystem.name + '-' + objectName.toUpperCase()) + '.abp');
            Notification.success('Downloaded ' + objectName.toUpperCase());
            $scope.isLoading = false; 
        }, function(){
                console.log('Unable to fetch source for object');
                Notification.error('Unable to download ' + objectName.toUpperCase());
                $scope.isLoading = false;
        });

    };
    
    $scope.isSelected = function(type) {
        switch (type) {
            case 1: 
                return type == $scope.selection.selectedOption.id;
            case 2: 
                return type == $scope.selection.selectedOption.id;
            case 3: 
                if ( $scope.selection.selectedOption.id == 3 || $scope.selection.selectedOption.id == 4 ) {
                    return true;
                }
                break;
            case 4: 
                return type == $scope.selection.selectedOption.id;
        }
    };
}