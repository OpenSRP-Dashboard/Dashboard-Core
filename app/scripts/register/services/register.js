'use strict';

angular.module('opensrpSiteApp')
   .service('Register', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope) {      
      
        this.getData = function ($scope) {
            var sampleRegisterUrl = OPENSRP_WEB_BASE_URL + "/sample-register"

            $rootScope.loading = true;                             

            $http.get(sampleRegisterUrl, { 
              cache: true
            })
            then(function successCallback(response) {
                $scope.data = response;    
                $rootScope.loading = false;                             
            }, function errorCallback(response) {
                $scope.data = response;    
                $rootScope.loading = false; 
            });
        };
    });
