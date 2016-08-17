'use strict';

angular.module('opensrpSiteApp')
   .service('Export', function ($q, $http, OPENSRP_WEB_BASE_URL, $rootScope) {      
      
        this.getData = function ($scope) {
            var sampleExportUrl = OPENSRP_WEB_BASE_URL + "/sample-export"

            $rootScope.loading = true;                             

            $http.get(sampleExportUrl, { 
              cache: true
            })
            .then(function successCallback(response) {
                $scope.data = response;    
                $rootScope.loading = false;                             
            }, function errorCallback(response) {
                $scope.data = "the data fetching was unsuccessful";    
                $rootScope.loading = false; 
            });
        };
    });
