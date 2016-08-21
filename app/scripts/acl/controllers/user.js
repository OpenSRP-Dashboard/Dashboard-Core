'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:AccesstokensCtrl
 * @description
 * # AccesstokensCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('UserCtrl', function ($scope,$rootScope,Flash,$window,$timeout,$location,$routeParams,$http,User,AclService, OPENSRP_WEB_BASE_URL,$q,Base64) {   
    
    //$scope.disabled = true;
    $scope.can = AclService.can;
    var userName = $routeParams.name;
    console.log("found userName- " + userName);
    if ($location.path() == '/add-user') {
      $rootScope.loading = true;      
      $scope.formData = {};
      //console.log($scope.formData.password + " -ho");
      User.getRolesAndUsers($scope, $rootScope, $timeout);     

      $scope.save = function(){
        console.log("form submitted");
        console.log($scope.formData);
        $scope.formData.children = [];
        $scope.formData.roles = [];

        for(var i =0; i<$scope.users.length; i++){
          if($scope.formData.selectedChildren[$scope.users[i].name]){
            $scope.formData.children.push({"user_name" : $scope.users[i].name, "id" : $scope.users[i].id});
          }
        }

        for(var i =0; i<$scope.roles.length; i++){
          if($scope.formData.selectedRoles[$scope.roles[i].name]){
            $scope.formData.roles.push({"name" : $scope.roles[i].name, "id" : $scope.roles[i].id});
          }
        }
        $scope.formData.password = Base64.encode($scope.formData.password);
        console.log($scope.formData);
        User.createUser($scope.formData,$window,Flash);
      }     
    }else if(userName){
      $rootScope.loading = true;      

      $scope.save = function(){
        console.log("form submitted");
        console.log($scope.formData);
        $scope.formData.children = [];
        $scope.formData.roles = [];

        for(var i =0; i<$scope.users.length; i++){
          if($scope.formData.selectedChildren[$scope.users[i].name]){
            $scope.formData.children.push({"user_name" : $scope.users[i].name, "id" : $scope.users[i].id});
          }
        }

        for(var i =0; i<$scope.roles.length; i++){
          if($scope.formData.selectedRoles[$scope.roles[i].name]){
            $scope.formData.roles.push({"name" : $scope.roles[i].name, "id" : $scope.roles[i].id});
          }
        }
        
        console.log($scope.formData);
        User.editUser($scope.formData,$window,Flash);
      }

      $scope.formData = {};
      User.getUserByName($scope,$rootScope,$timeout,userName,$q);
    }else{
      $rootScope.loading = true;
      $scope.userAssign =
      ' <a href="#/add-user">'+
      '<i class="glyphicon glyphicon-list-alt"></i>'+
      ' <span>Add User</span>'+
      '</a>';
      User.getAllUsers($scope,$rootScope);
    }

    $scope.ifOneElementOfBooleanArrayIsTrue = function (object) {
      return Object.keys(object).some(function (key) {
        //console.log("called for key -" + key);
        return object[key];
      });
    };
    
    $scope.roleCheckboxClicked = function (toggleThis) {
      $scope.formData.selectedRoles[toggleThis] = ! $scope.formData.selectedRoles[toggleThis];
      console.log($scope.formData.selectedRoles);
      if($scope.ifOneElementOfBooleanArrayIsTrue($scope.formData.selectedRoles)){
        console.log("at least one role is selected");
        if(!$("#decoyCheckbox").is(':checked')){
          $("#decoyCheckbox").click();
        }
      }
      else{
        console.log("no role is selected");
        if($("#decoyCheckbox").is(':checked')){
          $("#decoyCheckbox").click();
        }
      }
    };
     
  });

angular.module('opensrpSiteApp').directive('usernameAvailable', function($q, $http,OPENSRP_WEB_BASE_URL) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, model) { 
      model.$asyncValidators.usernameExists = function(modelValue, viewValue) { 
        console.log("modelValue " + modelValue + " -- viewValue " + + viewValue)
        console.log(elm);
        console.log(attr);
        console.log("attr.ngDisabled " + attr.ngDisabled + " --- attr.disabled " + attr.disabled);
        console.log(model);
        console.log("inside asyncValidator directive with username- " + model.$viewValue);

        var url = OPENSRP_WEB_BASE_URL + "/valid-username?userName=" + model.$viewValue;
        scope.addUser.user_name.$setValidity("usernameAlreadyTaken", true);
        return $http.get(url).success(function (data) {          
          attr.$observe('disabled', function(value){
            console.log("if the elem with usernameAvailable is disabled " + value);
            if(value){
              model.$setValidity('usernameExists', true); 
            }
            else{
              console.log("received response- " + data);   
              if(data == "1"){
                model.$setValidity('usernameExists  ', true); 
                console.log("inside valid userName");  
              }
              else{
                console.log("inside username already taken section");
                scope.addUser.user_name.$setValidity("usernameAlreadyTaken", false);
              }      
            }
          });   
          
        });   
      };
    }
  } 
});

  