angular.module('ISSOWDash').factory('transportsService', ['$http', '$q', function ($http, $q) {

        var selectedTask = {};

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
                setSelectedTask: function(transport) {
                    selectedTask = transport;
                },

                getSelectedTask: function() {
                    return selectedTask;
                },

                getDevelopmentSystems: function() {
                    return ($http.get('/systems').then(handleSuccess, handleError));
                }, 

                getTransportsForUsers: function(system, users) {
                    var url = ""; 
                    if (users.length === 0) {
                        url = '/sap/bc/resource/transports/modifiable?sapsystem=' + system;
                    } else {
                        url = '/sap/bc/resource/transports/modifiable/' + users.join('+') + '?sapsystem=' + system;
                    }           

                    return($http.get(url).then(handleSuccess, handleError));     
                },

                getReleasedTransportsSince: function(system, sinceXDays) {
                    return($http.get('/sap/bc/resource/transports/released/' + sinceXDays + '?sapsystem=' + system).then(handleSuccess, handleError));     
                },

                getObjectsForTask:function(transport) {
                    var url = '/sap/bc/resource/transports/transport/' + transport.trkorr + '/objects?sapsystem=' + transport.sysid;
                    return($http.get(url).then(handleSuccess, handleError));       
                },

                getTransport:function(transportName) {
                    var url = '/sap/bc/resource/transports/transport/' + transportName + '?sapsystem=' + transportName.substring(0,3);
                    return($http.get(url).then(handleSuccess, handleError));       
                },

                releaseTask: function(transport) {

                    var promise = $http({
                        // GET CSRF token 
                        url: '/sap/public/ping?sapsystem=' + transport.sysid,
                        method: "GET",
                        headers: {'Content-Type': 'application/json', 'X-CSRF-Token':'fetch'}
                    })
                    .then(function(response) {
                        //POST data 
                        console.log("Got token " + response.headers('x-csrf-token')); 
                        return ($http({
                            url: '/sap/bc/resource/transports/transport/' + transport.trkorr + '/release?sapsystem=' + transport.sysid,
                            method: "POST",
                            headers: {'Content-Type': 'application/json', 'X-CSRF-Token':response.headers('x-csrf-token')}                    
                        })
                        .then(handleSuccess, handleError));

                    }, 
                    function(response) { // optional
                        console.log("API GET error"); 
                    }
                    );

                    return promise;

                },

                updateTransport: function(transport) {
       
                    var promise = $http({
                        // GET CSRF token 
                        url: '/sap/public/ping?sapsystem=' + transport.sysid,
                        method: "GET",
                        headers: {'Content-Type': 'application/json', 'X-CSRF-Token':'fetch'}
                    })
                    .then(function(response) {
                        //POST data 
                        console.log("Got token " + response.headers('x-csrf-token')); 
                        return ($http({
                            url: '/sap/bc/resource/transports/transport/' + transport.trkorr + '?sapsystem=' + transport.sysid,
                            method: "POST",
                            data: transport,
                            headers: {'Content-Type': 'application/json', 'X-CSRF-Token':response.headers('x-csrf-token')}                    
                        })
                        .then(handleSuccess, handleError));

                    }, 
                    function(response) { // optional
                        console.log("API GET error"); 
                    }
                    );

                    return promise;

                },
                getLastModifiedDateAsText: function(dateTime) {
                    //Convert date to local timezone
                    var uSDateTime = moment.tz(dateTime, constants.SAP_SYSTEM_TIMEZONE);
                    var localDate = uSDateTime.clone().tz(constants.MY_LOCAL_TIMEZONE);    

                    return _.capitalize(moment(localDate).fromNow());
                },

                getSourceForObjectAtUrl: function(url) {
                      return($http.get(url).then(handleSuccess, handleError));
                }

            }; //service

        return service; 
    }]);