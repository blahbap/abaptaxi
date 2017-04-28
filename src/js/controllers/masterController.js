/**
 * Master Controller
 */

angular.module('ISSOWDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$base64', '$window', '$q', 'Notification', '$state', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $rootScope, $base64, $window, $q, Notification, $state) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };


    //*************** DASHBOARD *********************

    //Login 
    $scope.systems = [];
    $scope.loggedInSystems = []; 
    $scope.user = {username:"", password:""}; 
    $scope.loading = false; 
    $scope.loginMessage = "Not logged in"; 

    //Refresh
    $scope.refresh = function() {
        $rootScope.$broadcast('refresh');
    };

   $scope.getSystemErrorClass = function(system) {
        switch (system.rc) {
            case 0:
                return "label-success";
            case 4: 
                return "label-warning";
            case 8:
                return "label-danger";
        }
    };

    $scope.logon = function() {
        $scope.loading = true; 

        $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode($scope.user.username + ':' + $scope.user.password);
        $http({method: 'GET', url: '/systems'}).
            success(function(data, status, headers, config) {
            $scope.systems = data; 
            var requests = [];
            
            //Logon to all systems
            for (var i = 0; i < $scope.systems.length; i++) {
                
                var promise = $http({method: 'GET', url: '/sap/public/ping?sapsystem=' + $scope.systems[i].name}).
                        success((function(system) {
                            return function(data) {
                                Notification.success('Logged in to ' + system);
                            };
                        })($scope.systems[i].name)).
                        error(function(data) {
                            alert(data);
                    });

                requests.push(promise);
            }

            $q.all(requests).then(function(data) {
                console.log("All logged in");
                $scope.loading = false;
                $state.go('modifiable');
                $scope.loginMessage = "Good to go";
                $scope.isLoggedIn = true;
                $scope.loading = false; 
            });



            }).
            error(function(data, status, headers, config) {
                alert('Unable to get list of SAP systems - could not log in');
            });

    };

    $http({method: 'GET', url: '/systems'}).
            success(function(data, status, headers, config) {
                $scope.systems = data; 
            });
}