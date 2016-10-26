'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.ACCESSTOKENS
 * @description
 * # ACCESSTOKENS
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')
  .service('User', function ($http,$rootScope,Base64,OPENSRP_WEB_BASE_URL, COUCHURL, $q, Location) {
    // AngularJS will instantiate a singleton by calling "new" on this function    
          
      this.getAllUsers = function ($scope,$rootScope){
        //"http://192.168.21.86:1337/192.168.21.86:5984/opensrp/_design/Privilege/_view/privilege_by_name";
        //var apiURLs = COUCHURL + "/opensrp/_design/User/_view/by_id"; 
        var apiURLs = OPENSRP_WEB_BASE_URL + "/get-all-users-with-role";
        $http.get(apiURLs, { 
          cache: false
        })
        .success(function (data) {
          $rootScope.Users = data;
          $rootScope.loading = false;
          $scope.disabled = false;
        });
      }

      this.getRolesAndUsers = function($scope, $rootScope, $timeout){        
        var userUrl = OPENSRP_WEB_BASE_URL + "/get-all-users";        
        var userRequest = $http.get(userUrl, { cache: false  });


        var roleUrl = OPENSRP_WEB_BASE_URL + "/get-all-roles";
        var roleRequest = $http.get(roleUrl, { cache: false });

        $q.all([userRequest, roleRequest]).then(function(results){
          console.log(results);
          var fetchedRoles = results[1].data;
          var fetchedUsers = results[0].data;
          $scope.users = [];
          $scope.formData.parent = {};
          $scope.formData.selectedChildren = [];
          for(var i = 0 ; i < fetchedUsers.length; i++){
            //$scope.users.push({ "name" : fetchedUsers.rows[i].key, "id" : fetchedUsers.rows[i].id });
            //$scope.formData.selectedChildren[fetchedUsers.rows[i].key] = false;
            $scope.users.push({ "name" : fetchedUsers[i].user_name, "id" : fetchedUsers[i].id });
            $scope.formData.selectedChildren[fetchedUsers[i].user_name] = false;
          }          
          console.log($scope.formData.selectedChildren );                   

          $scope.roles = [];
          $scope.formData.selectedRoles = [];
          for(var i = 0 ; i < fetchedRoles.length; i++){
            //$scope.roles.push({ "name" : fetchedRoles.rows[i].key, "id" : fetchedRoles.rows[i].id });
            $scope.roles.push({ "name" : fetchedRoles[i].name, "id" : fetchedRoles[i].id });
            $scope.formData.selectedRoles[fetchedRoles[i].name] = false;
          }          
          console.log($scope.formData.selectedRoles );
          
          $scope.formData.password="";
          $scope.formData.email = "";

          $scope.ifEdit = false; 
          $rootScope.loading = false;
          $scope.disabled = false;
          $("#password").val();
          $("#email").val();
        });
      }
      this.editUser = function(data,$window,Flash){
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-user";          
        delete data.selectedChildren;
        delete data.selectedRoles;
        delete data.decoyCheckbox;
        console.log(data);    
        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
          $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully edit user. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/users';
          }else{
             $("#message").html("<p class='lead'>Failed to edit user</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });  

      }
      this.createUser = function(data,$window,Flash){
        
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/add-user";          
        delete data.selectedChildren;
        delete data.selectedRoles;
        delete data.decoyCheckbox;
        console.log(data);    
        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully created a user. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/users';
          }else{
             $("#message").html("<p class='lead'>Failed to create user</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });
      };

      this.initiateLocationAssignment = function($scope,$rootScope,$timeout,id,$q){
        console.log("User.initiateLocationAssignment called.");    
        $rootScope.loading = true;
        var Userurl = OPENSRP_WEB_BASE_URL + "/get-user-by-name?userName=" + id;
        //var Userurl = COUCHURL+'/opensrp/_design/User/_view/by_user_name?key="' + id + '"';   
        var locationInfoUrl = OPENSRP_WEB_BASE_URL + '/get-location-info?locationId=' ;
        
        //this.getUserByName($scope,$rootScope,$timeout,id,$q);

        $http.get(Userurl, { 
          cache: false,
        })
        .success(function (data) {
          Location.getAllLocationTags($scope,$rootScope);
          
          $scope.currentUser = data;//.rows[0].value;
          if($scope.currentUser.location && $scope.currentUser.location.length > 0){

            $http.get(locationInfoUrl+ $scope.currentUser.location[0].id, { cache: false})
              .success(function(data){
                console.log(data);
                $scope.selections['Ward'] = data.parentWard.id;
                $scope.selectOptions['Ward'] = data.parentWardSiblings;  

                $scope.selections['Union'] = data.parentUnion.id;
                $scope.selectOptions['Union'] = data.parentUnionSiblings;  

                $scope.selections['Upazilla'] = data.parentUpazilla.id;
                $scope.selectOptions['Upazilla'] = data.parentUpazillaSiblings;  

                $scope.selections['District'] = data.parentDistrict.id;
                $scope.selectOptions['District'] = data.parentDistrictSiblings;  

                $scope.selections['Division'] = data.parentDivision.id;
                $scope.selectOptions['Division'] = data.parentDivisionSiblings; 

                $scope.selections['Division'] = data.parentDivision.id;
                $scope.selectOptions['Division'] = data.parentDivisionSiblings; 

                $scope.selectOptions['Unit'] = data.ownSiblings;

                if(data.ownSiblings && data.ownSiblings.length>0) {
                  for(var i = 0 ; i < $scope.currentUser.location.length; i++){
                    $scope.unitSelections[$scope.currentUser.location[i].name] = true;  
                  }
                }
              });
          }else{
            Location.getChildrenLocationsAndAppend($scope, $rootScope, "", "Division");
          }
        });
      }; 

      this.assignLocationToUser = function(data, $window){
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        
        var apiURLs = OPENSRP_WEB_BASE_URL+"/assign-location-to-user"; 

        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            console.log("Location assignment to user done.");
            $window.location = '/#/users';
          }else{
            console.log("Location assignment to user failed");
          }
          
        });
        
      }; 

      this.getUserByName =  function($scope,$rootScope,$timeout,id,$q){
        console.log("User.userByName called.");
        //http://localhost:5984/opensrp/_design/Privilege/_view/privilege_by_id?key=%225da9913d2e051554a772deae8b02aa0b%22
        var url = OPENSRP_WEB_BASE_URL + "/get-user-by-name?userName=" + id; // COUCHURL+'/opensrp/_design/User/_view/by_user_name?key="' + id + '"';  
        var roleUrl = OPENSRP_WEB_BASE_URL + "/get-all-roles"; //COUCHURL + "/opensrp/_design/Role/_view/role_by_name";
        var userUrl =  OPENSRP_WEB_BASE_URL + "/get-all-users";// COUCHURL + "/opensrp/_design/User/_view/by_user_name"; // "/all-user-name";
        $rootScope.loading = true;
        var fetchedRoles = $http.get(roleUrl,{ 
          cache: false
        }); 
        var fetchedUsers = $http.get(userUrl,{ 
          cache: false
        });
        var fetchedCurrentUser = $http.get(url,{ 
          cache: true
        } );

        $q.all([fetchedRoles, fetchedUsers, fetchedCurrentUser]).then(function(results){
          console.log(results[0].data);
          console.log(results[1].data);
          console.log(results[2].data);

          $scope.roles = results[0].data;//[];
          $scope.formData.selectedRoles = [];
          for(var i = 0 ; i < $scope.roles.length; i++){
            $scope.formData.selectedRoles[$scope.roles[i].id] = false;
          } 

          $scope.users = results[1].data; //[];
          $scope.formData.parent = {};
          $scope.formData.selectedChildren = [];
          for(var i = 0 ; i < $scope.users.length; i++){
            $scope.formData.selectedChildren[$scope.users[i].user_name] = false;
          }

          $scope.formData.given_name = results[2].data.given_name;
          $scope.formData.middle_name = results[2].data.middle_name;
          $scope.formData.family_name = results[2].data.family_name;
          $scope.formData.contact_number = Number(results[2].data.contact_number);
          $scope.formData.email = results[2].data.email;
          $scope.formData.personal_address = results[2].data.personal_address;
          $scope.formData.user_name = results[2].data.user_name;
          $scope.formData.gender = results[2].data.gender;
          $('select[name="gender"]').val(results[2].data.gender);
          $('select[name="parent"]').val('demosrp');//results[2].data.rows[0].value.parent.user_name);
          $scope.formData.parent={'user_name': results[2].data.parent.user_name, 
            'id':results[2].data.parent.id};
          console.log("the parent is " + results[2].data.parent.user_name);
          console.log("expected gender- " + results[2].data.gender);
          //$scope.role = results[2].data.rows[0].value;
          //$scope.formData.id = $scope.role._id;  
          $scope.formData.password = "";

          for(var i = 0 ; i < results[2].data.roles.length; i++){
            $scope.formData.selectedRoles[results[2].data.roles[i].name] = true;
          }
          $("#decoyCheckbox").click();          
          console.log($scope.formData.selectedRoles);
          if(results[2].data.children){
            for(var i = 0 ; i < results[2].data.children.length; i++){
              console.log("found children- " + results[2].data.children[i].user_name);
              $scope.formData.selectedChildren[results[2].data.children[i].user_name] = true;
            } 
          }
          
          $scope.ifEdit = true;
          $rootScope.loading = false;
        });  
      };     
  });
