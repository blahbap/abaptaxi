angular.module('ISSOWDash').factory('loginService', ['$scope', '$cookieStore', '$http', '$rootScope', '$base64', '$window', '$q', '$state', '$timeout', 
    function ($scope, $cookieStore, $http, $rootScope, $base64, $window, $q, $state, $timeout) {

    
        function handleSuccess( response ) {
            return( response.data );
        }

        function handleError( response ) {
            // The API response from the server should be returned in a
            // normalized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        var service = 
            {
                isLoggedIn:false, 
                login: function(username, password) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode(username + ':' + password);
                    $http({method: 'GET', url: '/sap/bc/resource/issow/dashboard/DEQ/systems'}).
                        success(function(data, status, headers, config) {
                        
                        var systems = data.systems;
                        var requests = [];
                        
                        //Logon to all systems
                        for (var i = 0; i < systems.length; i++) {
                            
                            var promise =$http({method: 'GET', url: '/sap/bc/resource/issow/dashboard/' + systems[i] + '/ping'}).
                                    success(function(data, status, headers, config) {
                                        
                                    }).
                                    error(function(data, status, headers, config) {
                                        alert(data);
                                });

                            requests.push(promise);
                        }

                        $q.all(requests).then(function(data) {
                            console.log("All logged in");
                        });

                        this.isLoggedIn = true;

                        }).
                        error(function(data, status, headers, config) {
                            alert('Unable to get list of SAP systems - could not log in');
                        });
                }

            }; //service

        return service; 
    }]);