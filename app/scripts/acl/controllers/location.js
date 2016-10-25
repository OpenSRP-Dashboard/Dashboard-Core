'use strict';

/**
 * @ngdoc function
 * @name opensrpSiteApp.controller:AccesstokensCtrl
 * @description
 * # AccesstokensCtrl
 * Controller of the opensrpSiteApp
 */
angular.module('opensrpSiteApp')
  .controller('LocationCtrl', function ($scope,$rootScope,Flash,$window,$timeout,$location,$routeParams,$http,Location,AclService, OPENSRP_WEB_BASE_URL,$q,Base64) {   
    
    //$scope.disabled = true;
    $scope.can = AclService.can;
    var locationId = $routeParams.id;

    if ($location.path() == '/locations') {
      $rootScope.loading = true;      
      Location.getAllLocationTags($scope, $rootScope);  
      $scope.fetchedLocations = [];   
      $scope.landingPage = true;

      $scope.loadLoactionsByTag = function(){
        console.log($scope.selectedTag);
        Location.getLocationsByTags($scope, $rootScope);
      }
    }
    else if ($location.path() == '/locations/add') 
    {
      $scope.namesNotAvailable = [];
      $scope.selections = {};
      $scope.selectOptions = {};
      $scope.show = {};
            
      $scope.textboxReached = false;

      // how to get the name and id of the location with roottag
      $scope.currentParentId = '';
      $scope.currentParentName = '';
      $scope.currentTagId = '';

      $rootScope.loading = true;
      Location.getAllLocationTags($scope, $rootScope);

      $scope.save = function(){
        console.log("hi from location save");

        var finalLocationData = { "name" : $scope.locationName,  "parentName" : $scope.currentParentName,
          "parentId" : $scope.currentParentId,  "tagId" : $scope.currentTagId };

        //console.log($scope.locationName);
        console.log(finalLocationData);
        Location.createLocation(finalLocationData, $window,Flash);
      }

      $scope.startLoadingSelect = function(){
        //$(".envelop").hide();

        // resetting the dropdowns and selections
        $scope.selections = {};
        $scope.selectOptions = {};
        $scope.currentTagId = 

        $scope.selectedTagIndex = 0;
        $scope.reachedTagIndex = 0;
        $scope.selectedTagName = "";
        $scope.textboxReached = false;          

        // how to get the name and id of the location with roottag
        /*$scope.currentParentId = '1e84829ef6153b9b8f05089b28020ae7';  
        $scope.currentParentName = 'Bangladesh'; */
        var found = 0 ;
        for(var i =0; i < $scope.sortedTags.length; i++ ){
          if($scope.sortedTags[i].id === $scope.selectedTag){
            $scope.selectedTagIndex = i;
            $scope.selectedTagName = $scope.sortedTags[i].name;
            $scope.currentTagId = $scope.sortedTags[i].id;
            //break;
            found = 1;
          }
          if(found == 0){
            $scope.show[$scope.sortedTags[i].name] = true;
          }
          else{
           $scope.show[$scope.sortedTags[i].name] = false; 
          }
        }
        console.log($scope.selectedTag);
        console.log($scope.selectedTagIndex);
        console.log("oka");
        //$scope.fetchChildrenLocations();
        // edge case for creating division
        if($scope.selectedTagIndex == 0){
          $scope.textboxReached = true;
        }

        //loading dropdowns always start with divisions, $scope.sortedTags[0] contains id and name of division tag
        Location.getChildrenLocationsAndAppend($scope, $rootScope, "", $scope.sortedTags[0].name);
      }

      $scope.loadChildSelect = function(nameOfSelectedTag){
        /*var currentValue = "value_" + $scope.sortedTags[$scope.reachedTagIndex].name;
        console.log(currentValue);*/
        //$scope.reachedTagIndex = 
        console.log(nameOfSelectedTag + " --value of something"); 
        console.log($scope.selections[nameOfSelectedTag]);     
        $scope.currentParentId = $scope.selections[nameOfSelectedTag];
        for(var i =0; i< $scope.selectOptions[nameOfSelectedTag].length; i++){
          if($scope.currentParentId == $scope.selectOptions[nameOfSelectedTag][i].id){
            $scope.currentParentName = $scope.selectOptions[nameOfSelectedTag][i].name;
          }
        }
        
        var childTagName;
        for(var i =0; i<$scope.sortedTags.length; i++){
          if($scope.sortedTags[i].name === nameOfSelectedTag){
            childTagName = $scope.sortedTags[i+1].name;
            $scope.reachedTagIndex = i;
          }
        }
        if(childTagName === $scope.selectedTagName){
          console.log("detected");
          $scope.textboxReached = true;          
        }
        else{
          $scope.textboxReached = false; 
        }

        //console.log('reached index- ' + $scope.reachedTagIndex);

        for(var i = $scope.reachedTagIndex + 1; i<$scope.sortedTags.length; i++){
          $scope.selections[$scope.sortedTags[i].name] = '';
          $scope.selectOptions[$scope.sortedTags[i].name] = '';  
        }

        Location.getChildrenLocationsAndAppend($scope, $rootScope, $scope.selections[nameOfSelectedTag], childTagName); 
        console.log($scope.selections);         
        console.log($scope.selectOptions);
      }
    }     
    else if(locationId){
      $scope.locationId = locationId;
      console.log("url works");
      $scope.ifEdit = true;

      $scope.namesNotAvailable = [];
      $scope.selections = {};
      $scope.selectOptions = {};
      $scope.show = {};
            
      $scope.textboxReached = false;

      // how to get the name and id of the location with roottag
      $scope.currentParentId = '';
      $scope.currentParentName = '';
      $scope.currentTagId = '';

      $rootScope.loading = true;
      Location.initiateLocationEdit($scope, $rootScope, $q);
      //Location.getAllLocationTags($scope, $rootScope);

      $scope.save = function(){
        console.log("hi from location save");

        var finalLocationData = { "name" : $scope.locationName,  "parentName" : $scope.currentParentName,
          "parentId" : $scope.currentParentId,  "tagId" : $scope.currentTagId, "id" : $scope.locationId };

        //console.log($scope.locationName);
        console.log(finalLocationData);
        Location.editLocation(finalLocationData, $window,Flash);
      }

    }
     
  });

angular.module('opensrpSiteApp').directive('validLocationName', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {      
       model.$parsers.unshift(function(value) {
          if(value){
            console.log(value);
            if(scope.namesNotAvailable.indexOf(value.toLowerCase()) > -1){
              scope.addLocation.locationName.$setValidity("notAvailable", false);                 
            }
            else{
              scope.addLocation.locationName.$setValidity("notAvailable", true);    
            }
            return value;
          }         
      });
    }
  } 
});
  