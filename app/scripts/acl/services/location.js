'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.ACCESSTOKENS
 * @description
 * # ACCESSTOKENS
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')
  .service('Location', function ($http,$rootScope,Base64,OPENSRP_WEB_BASE_URL, COUCHURL, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function    
          
      this.getParentTag = function(targetParentId, tags){
        for(var i= 0; i< tags.length; i++){
          if(tags[i].parentTagId === targetParentId){
            console.log("returning " + tags[i]);
            return tags[i];
          }
        }
      }

      this.getLocationsByTags = function($scope,$rootScope){
       var apiURLs = OPENSRP_WEB_BASE_URL+"/get-locations-by-tag?tagId=" + $scope.selectedTag;  
        $rootScope.loading = true;   
        $http.get(apiURLs, { cache: false}).success(function (data) {
          $scope.fetchedLocations = data;
        });
        $rootScope.loading = false;
      }

      this.getAllLocationTags = function($scope,$rootScope){
        var apiURLs = OPENSRP_WEB_BASE_URL+"/get-all-location-tags";  
        $rootScope.loading = true;   
        $http.get(apiURLs, { cache: false}).success(function (data) {
          $scope.locationTags = [];
          $scope.allLocationTags = data;
          /*for(var i = 0; i < data.length; i++){            
            if(data[i].name !== "Country"){
              $scope.locationTags.push(data[i]);
            }
          }*/        
          
          $scope.rootTag = {};
          for(var i = 0; i < data.length; i++){
            if(data[i].parentTagId === ""){
              $scope.rootTag = data[i];
              break;
            }
          }   

          $scope.sortedTags = [];
          //$scope.sortedTags.push(rootTag);
          var currentTag = $scope.rootTag;
          for(var i = 0; i < data.length - 1; i++){
            for(var j= 0; j< data.length; j++){
              if(data[j].parentTagId === currentTag.id){
                console.log("returning " + data[j].name);
                currentTag = data[j];
                break;
                //return tags[i];
              }
            }
            $scope.sortedTags.push(currentTag);            
          }

          console.log($scope.sortedTags);

          if($scope.landingPage){
            $http.get(OPENSRP_WEB_BASE_URL + "/get-children-locations-of-root", { cache: false}).success(function (data) {
              $scope.fetchedLocations = data;
              $rootScope.loading = false;
            });
          }
          else{
            $rootScope.loading = false;
          }
          
        });     
      }      

      this.getChildrenLocationsAndAppend = function($scope, $rootScope, parentId, parentLocationTag){
        var apiURLs;
        console.log(parentId);
        console.log(parentLocationTag);
        if(parentId == ""){ 
          apiURLs = OPENSRP_WEB_BASE_URL + "/get-children-locations-of-root";
        }
        else{
          apiURLs = OPENSRP_WEB_BASE_URL+ "/get-children-locations?dashboardLocationId=" + parentId;  
        }
        
        $rootScope.loading = true;   
        $http.get(apiURLs, { cache: false}).success(function (data) {
          if($scope.textboxReached){
            $scope.namesNotAvailable = [];
            $.each(data, function() {
                $scope.namesNotAvailable.push(this.name.toLowerCase());              
            });
            console.log("names collected");
            console.log($scope.namesNotAvailable);
          }
          else{
            console.log(data);
            $scope.selectOptions[parentLocationTag] = data;  
          } 

          // here we can find the name and id of root location given that the parentId and parentName fields returned locations are valid         
          if(parentId == "" && data.length > 0){
            $scope.currentParentId = data[0].parentId;
            $scope.currentParentName = data[0].parentName; 
          }
          
          $rootScope.loading = false;
        }); 

      }

      this.createLocation = function(data,$window,Flash){
        
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/add-dashboard-location";          
        console.log(data);    

        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully created a new location. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/locations';
          }else{
             $("#message").html("<p class='lead'>Failed to create location</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });
      };

      this.editLocation = function(data,$window,Flash){
        
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-dashboard-location";          
        console.log(data);    

        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully created a new location. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/locations';
          }else{
             $("#message").html("<p class='lead'>Failed to create location</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });
      };

      this.initiateLocationEditNew = function($scope, $rootScope, $q){
        var locationInfoUrl = OPENSRP_WEB_BASE_URL + '/get-location-info-new?locationId=' + $scope.locationId;
        var locationTagUrl = OPENSRP_WEB_BASE_URL+"/get-all-location-tags";  
        var callForLocationTags = $http.get(locationTagUrl, { cache: false});
        var callForLocationInfo = $http.get(locationInfoUrl, { cache: false});
        /*$http.get(locationInfoUrl, { cache: false}).success(function (data) {
          console.log(data);
          $
        });*/
        $q.all([callForLocationTags, callForLocationInfo]).then(function(results){
          console.log(results[0].data);
          console.log(results[1].data);

          $scope.locationTags = [];
          $scope.allLocationTags = results[0].data;        
          
          $scope.rootTag = {};
          for(var i = 0; i < results[0].data.length; i++){
            if(results[0].data[i].parentTagId === ""){
              $scope.rootTag = results[0].data[i];
              break;
            }
          }   

          $scope.sortedTags = [];
          //$scope.sortedTags.push(rootTag);
          var currentTag = $scope.rootTag;
          for(var i = 0; i < results[0].data.length - 1; i++){
            for(var j= 0; j< results[0].data.length; j++){
              if(results[0].data[j].parentTagId === currentTag.id){
                console.log("returning " + results[0].data[j].name);
                currentTag = results[0].data[j];
                break;
                //return tags[i];
              }
            }
            $scope.sortedTags.push(currentTag);            
          }

          console.log($scope.sortedTags);
          
          var found = 0;
          for(var i = 0; i < $scope.sortedTags.length; i++){
            if(results[1].data.tagName === $scope.sortedTags[i].name){
              found = 1;
              $scope.selectedTagIndex = i;
              $scope.currentTagId = $scope.sortedTags[i].id;
              $scope.selectedTag = $scope.sortedTags[i].id;
              $scope.selectedTagName = results[1].data.tagName;
              $scope.textboxReached = true;                                          
            }
            if(found == 0){
              $scope.show[$scope.sortedTags[i].name] = true;              
            }
            else{
             $scope.show[$scope.sortedTags[i].name] = false; 
            }
          }

          for(var i = 0; i < results[1].data.locations.length; i++){
            $scope.selectOptions[results[1].data.locations[i].tagName] = results[1].data.locations[i].ownSiblings;
            $scope.selections[results[1].data.locations[i].tagName] = results[1].data.locations[i].currentSelection.id;
            if(results[1].data.locations[i].tagName === results[1].data.tagName){
              $scope.currentParentId =  results[1].data.locations[i].parentSelection.id;
              $scope.currentParentName = results[1].data.locations[i].parentSelection.name;      
              $scope.locationName = results[1].data.locations[i].currentSelection.name;
            }
          }    

          $scope.selectedTagName = results[1].data.tagName;

          $rootScope.loading = false;
        })
        
      }

      this.initiateLocationEdit = function($scope, $rootScope, $q){
        var locationInfoUrl = OPENSRP_WEB_BASE_URL + '/get-location-info?locationId=' + $scope.locationId;
        var locationTagUrl = OPENSRP_WEB_BASE_URL+"/get-all-location-tags";  
        var callForLocationTags = $http.get(locationTagUrl, { cache: false});
        var callForLocationInfo = $http.get(locationInfoUrl, { cache: false});
        /*$http.get(locationInfoUrl, { cache: false}).success(function (data) {
          console.log(data);
          $
        });*/
        $q.all([callForLocationTags, callForLocationInfo]).then(function(results){
          console.log(results[0].data);
          console.log(results[1].data);

          $scope.locationTags = [];
          $scope.allLocationTags = results[0].data;        
          
          $scope.rootTag = {};
          for(var i = 0; i < results[0].data.length; i++){
            if(results[0].data[i].parentTagId === ""){
              $scope.rootTag = results[0].data[i];
              break;
            }
          }   

          $scope.sortedTags = [];
          //$scope.sortedTags.push(rootTag);
          var currentTag = $scope.rootTag;
          for(var i = 0; i < results[0].data.length - 1; i++){
            for(var j= 0; j< results[0].data.length; j++){
              if(results[0].data[j].parentTagId === currentTag.id){
                console.log("returning " + results[0].data[j].name);
                currentTag = results[0].data[j];
                break;
                //return tags[i];
              }
            }
            $scope.sortedTags.push(currentTag);            
          }

          console.log($scope.sortedTags);
          
          var found = 0;
          for(var i = 0; i < $scope.sortedTags.length; i++){
            if(results[1].data.tagName === $scope.sortedTags[i].name){
              found = 1;
              $scope.selectedTagIndex = i;
              $scope.selectedTag = $scope.sortedTags[i].id;
              $scope.currentTagId = $scope.sortedTags[i].id;
              $scope.selectedTagName = results[1].data.tagName;
              $scope.textboxReached = true;
              $scope.currentParentId =  results[1].data['parent' + $scope.sortedTags[i-1].name].id ;
              $scope.currentParentName = results[1].data['parent' + $scope.sortedTags[i-1].name].name;
            }
            if(found == 0){
              $scope.show[$scope.sortedTags[i].name] = true;
              $scope.selectOptions[$scope.sortedTags[i].name] = results[1].data['parent' + $scope.sortedTags[i].name + 'Siblings'] ;
              $scope.selections[$scope.sortedTags[i].name] = results[1].data['parent' + $scope.sortedTags[i].name].id ;
            }
            else{
             $scope.show[$scope.sortedTags[i].name] = false; 
            }
          }

          for(var i =0 ; i < results[1].data.ownSiblings.length; i++){
            if($scope.locationId === results[1].data.ownSiblings[i].id){
              $scope.locationName = results[1].data.ownSiblings[i].name;
            }
          }
          $scope.selectedTagName = results[1].data.tagName;

          $rootScope.loading = false;
        })
        
      }
  });
