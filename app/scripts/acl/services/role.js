'use strict';

/**
 * @ngdoc service
 * @name opensrpSiteApp.ROLE
 * @description
 * # ROLE
 * Service in the opensrpSiteApp.
 */
angular.module('opensrpSiteApp')
  .service('Role', function ($http,$rootScope,Base64,OPENSRP_WEB_BASE_URL, COUCHURL, $q) {  
    var privileges = null;

      this.save = function(data,$window,Flash){
        
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        var apiURLs = OPENSRP_WEB_BASE_URL+"/add-role";   
        data.privileges = [];
        for(var i = 0; i < $rootScope.accessList.length; i++){
          if(data.privilegesOfCurrentRole[$rootScope.accessList[i].name]){
            data.privileges.push({ "name": $rootScope.accessList[i].name, 
                                    "id" : $rootScope.accessList[i].id});
          }
        }
        delete data.privilegesOfCurrentRole;
        console.log(data);    
        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {            
            var message = '<strong>Successfully created a role. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/roles';
          }else{
             $("#message").html("<p class='lead'>Failed to create role</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        }); 
      };

      this.getPrivileges = function($rootScope, $timeout, $scope, roleId){
        var allPrivilegesApiUrl = COUCHURL + '/opensrp/_design/Privilege/_view/privilege_by_name';
        var roleByIdApiUrl = COUCHURL+'/opensrp/_design/Role/_view/role_by_id?key="' + roleId + '"';   

        $rootScope.loading = true;

        var getAllPrivileges = $http.get(allPrivilegesApiUrl,{ 
           cache: true, 
            withCredentials: false,                  
            headers: {
              'Authorization' : ''
            }
        }); 

        var getPrivilegeById = $http.get(roleByIdApiUrl,{ 
           cache: true, 
            withCredentials: false,                  
            headers: {
              'Authorization' : ''
            }
        }); 

        $q.all([getAllPrivileges, getPrivilegeById]).then(function(results){
          console.log(results[0].data);
          console.log(results[1].data);

          if(results[0].data.rows.length > 0){
            console.log("privileges are fetched successfully");
            console.log(results[0].data); 
            $rootScope.accessList = [];
            for(var i = 0; i < results[0].data.rows.length; i++){
              $rootScope.accessList.push({"name" : results[0].data.rows[i].key, "id" : results[0].data.rows[i].id});
            }
            console.log($rootScope.accessList);
            if($scope.addRole){
              $scope.formData.privilegesOfCurrentRole = {};
              for(var i = 0; i < $rootScope.accessList.length; i++){
                $scope.formData.privilegesOfCurrentRole[$rootScope.accessList[i].name] = false;
              }
              }
          }

          if(results[1].data.rows.length > 0){
            console.log("role data successfully fetched for id- " + roleId);
            console.log(results[1].data);  
            $scope.role = results[1].data.rows[0].value;

            $scope.formData = {};
            $scope.formData.name = $scope.role.name;
            $scope.formData.id = $scope.role._id;
            $scope.formData.privilegesOfCurrentRole = {};

            for(var i = 0; i < $rootScope.accessList.length; i++){
              $scope.formData.privilegesOfCurrentRole[$rootScope.accessList[i].name] = false;
            }
            for(var i =0; i < $scope.role.privileges.length; i++){
              $scope.formData.privilegesOfCurrentRole[$scope.role.privileges[i].name] = true;
            }
            $scope.formData.status = $scope.role.status;
            console.log($scope.formData);
          } 

          $rootScope.loading = false;
        });  
      };

      this.edit = function(data,$window,Flash){
              
        $("#submit").attr('disabled','disabled');
        $("#submit").html("Please Wait");
        var apiURLs = OPENSRP_WEB_BASE_URL+"/edit-role";     
        data.privileges = [];
        for(var i = 0; i < $rootScope.accessList.length; i++){
          if(data.privilegesOfCurrentRole[$rootScope.accessList[i].name]){
            data.privileges.push({ "name": $rootScope.accessList[i].name, 
                                    "id" : $rootScope.accessList[i].id});
          }
        }
        //console.log(data);
        delete data.privilegesOfCurrentRole;
        console.log("final object being sent- " + data);

        $http.post(apiURLs, data).success(function (data) {
          $("#submit").html("Submit");
           $('#submit').prop('disabled', false);
          if (data == 1) {
            
            var message = '<strong>Successfully edit a role. </strong> ';
            Flash.create('success', message, 'custom-class');
            $window.location = '/#/roles';
          }else{
             $("#message").html("<p class='lead'>Error while updating</p>");
            $( "#message" ).delay(3000).fadeOut( "slow" );
          }
          
        });
      };

      this.getAllRoles =  function($scope,$rootScope){
        //http://localhost:5984/opensrp/_design/Privilege/_view/privilege_by_id?key=%225da9913d2e051554a772deae8b02aa0b%22
        var url = COUCHURL+'/opensrp/_design/Role/_view/role_by_id';              
        
        $http.get(url, { 
          cache: false, 
          withCredentials: false,                  
          headers: {
            'Authorization' : ''
          }
        })
        .success(function (data) {                         
          console.log("all roles fetched.");
          console.log(data);       
          $scope.roles = data.rows;     
        });
      };      
  });
