'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.page
 * @description
 * # page
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')   
   .service('Page', function (filterFilter) {
      this.dataFilter = function($scope,data,$filter,defaultSort,object){
        $scope.search = {};
        $scope.resetFilters = function () {    
          $scope.search = {};
        };
       
        $scope.sortType     = defaultSort; // set the default sort type
        $scope.sortReverse  = false;
        $scope.currentPage = 1;
        $scope.totalItems = data.length;        
        $scope.entryLimit = 10; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        
        $scope.$watch('search', function (newVal, oldVal) {   
            
          $scope.filtered = $filter('filter')(data,newVal, true); 
          $scope.totalItems = $scope.filtered.length;          
          $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
          $scope.currentPage = 1;
        }, true);
      };
  });
