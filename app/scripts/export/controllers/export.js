'use strict';

angular.module('opensrpSiteApp')
   .controller('ExportCtrl', function ($scope,$rootScope, $location, $http, $window,$timeout, Export) {
        Export.getData($scope);
        $scope.forms = ["form - A", "form - B"];
        $scope.dateRange = {
          startDate: moment(new Date('January 1, 2016')).format('YYYY-MM-DD'),
          endDate: moment(new Date()).format('YYYY-MM-DD')
        };
        $scope.export = function(){
            console.log($scope.dropdown);
            console.log($scope.dateRange);
        }
    });
