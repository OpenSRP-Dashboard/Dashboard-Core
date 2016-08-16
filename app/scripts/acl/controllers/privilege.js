'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:EcCtrl
 * @description
 * # EcCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('PrivilegeCtrl', function ($scope,$http,$rootScope,Page,Common,$routeParams,$timeout,AclService,$location,$filter,Privilege,OPENSRP_WEB_BASE_URL,$window,Flash) {
    $scope.can = AclService.can;   

    var id = $routeParams.id;
    if (id) {
      $scope.id= id;
      $rootScope.loading = true;
      Privilege.getPrivilegeById($scope,$rootScope,$timeout,id);        
      
      $scope.edit= function(){
         console.log($scope.formData);
         Privilege.edit($scope.formData,$window,Flash,id);           
      }         
    }else if( $location.path() =='/add-privilege' ){  
      $scope.save = function() {
        Privilege.save($scope.formData,$window,Flash, $location);
      };
    }else{
      Privilege.getAllPrivileges($scope, $rootScope);
    }    
  });
