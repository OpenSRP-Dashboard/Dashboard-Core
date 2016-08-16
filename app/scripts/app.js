'use strict';

/**
 * @ngdoc overview
 * @name expressAngularAppApp
 * @description
 * # expressAngularAppApp
 *
 * Main module of the application.
 */
angular
  .module('opensrpSiteApp', ['ngBootstrap','ngAnimate','ngCookies','ngResource','ngRoute','angular-momentjs','ngSanitize','ngTouch','ui.bootstrap','ngDialog','angular-mapbox','nvd3','chart.js','checklist-model','mm.acl','flash', 'ngMessages'])
  .constant('AUTH_URL', 'http://192.168.21.167:1337/27.147.129.50:9979/authenticate-user')
  //.constant('OPENSRP_WEB_BASE_URL', 'http://192.168.21.246:1234/192.168.21.246:9979')
  //ip for jivita server - 192.168.19.90  
  //.constant('OPENSRP_WEB_BASE_URL', 'http://27.147.129.50:1234/192.168.19.55:9979')
  .constant('OPENSRP_WEB_BASE_URL', 'http://192.168.22.158:1337/192.168.22.158:9979')
  //.constant('OPENSRP_WEB_BASE_URL', 'http://192.168.22.152:1234/192.168.22.152:9979')
  .constant("HH_REGISTER_ENTRY_URL_API",'27.147.129.50:9979/registers/hh?anm-id=')
  .constant("ELCO_REGISTER_ENTRY_URL_API",'27.147.129.50:9979/registers/ec?anm-id=') 
  .constant("COUCHURL",'http://192.168.22.158:1337/192.168.22.158:5984')
  .config(['AclServiceProvider', function (AclServiceProvider) {
    var myConfig = {
      storage: 'sessionStorage',  // localStorage
      storageKey: 'AppAcl'
    };
    AclServiceProvider.config(myConfig);
  }])
  .config(['AclServiceProvider', function (AclServiceProvider) {
    AclServiceProvider.resume();
  }])
  .config(['$httpProvider', function ($httpProvider) {           
      $httpProvider.defaults.cache = true;
  }])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/anotherRoute', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
        
      })
  })
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/acl/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'        
      })
      .when('/add-role', {
        templateUrl: 'views/acl/role.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Role')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })      
      .when('/roles', {
        templateUrl: 'views/acl/roles.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
        resolve : {
          'userData':function(Role){ return Role.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Add Role')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/role/:roleId', {
        templateUrl: 'views/acl/role-edit.html',
        controller: 'RoleCtrl',
        controllerAs: 'role',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Role Edit')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/add-user', {
        templateUrl: 'views/acl/user_add_edit.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('User Assign')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/users', {
        templateUrl: 'views/acl/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('User List')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/user/:name', {
        templateUrl: 'views/acl/user_add_edit.html',
        controller: 'UserCtrl',
        controllerAs: 'user',
        resolve : {
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('User Assign Edit')){
              // Has proper permissions
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }
      })
      .when('/privileges', {
        templateUrl: 'views/acl/privileges.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {
          //'userData':function(privilegeService){ return privilegeService.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Acl')){
              // Has proper permissions
              //console.log('is it true?' + AclService.can('Elco Details'));
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
              //return true;
            
            }
          }]
        }        
      })
      .when('/add-privilege', {
        templateUrl: 'views/acl/privilege_add.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {
          //'userData':function(testService){ return testService.promise;},
          'acl' : ['$q', 'AclService', function($q, AclService){
            if(AclService.can('Acl')){
              // Has proper permissions
              //console.log('is it true?' + AclService.can('Elco Details'));
              return true;
            } else {
              // Does not have permission
              return $q.reject('Unauthorized');
            
            }
          }]
        }        
      })
      .when('/privileges/:id', {
        templateUrl: 'views/acl/privilege_edit.html',
        controller: 'PrivilegeCtrl',
        controllerAs: 'PrivilegeCtrl',
        resolve : {          
          'acl' : ['$q', 'AclService', function($q, AclService){
          if(AclService.can('Acl')){
            // Has proper permissions
            //console.log('is it true?' + AclService.can('Elco Details'));
            return true;
          } else {
            // Does not have permission
            return $q.reject('Unauthorized');
          
          }
          }]
        }
      })
      .when('/login', {
        templateUrl: 'views/acl/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/logout', {
        templateUrl: 'views/acl/login.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
       .when('/un-authorized', {
        templateUrl: 'views/acl/unauthorized.html',
        controller: 'UnauthorizedCtrl',
        controllerAs: 'unauthorized',        
      })
      .otherwise({
        redirectTo: '/'
      });
      //$locationProvider.html5Mode(true);
  })  
  .run(function ($rootScope, $location, $window, $timeout,AclService, Authentication, $http,$q,Base64,OPENSRP_WEB_BASE_URL) {
    'use strict';

    $rootScope.$on('$routeChangeError', function (current, previous, rejection) {        
      $location.path('/un-authorized');    
    });

    $rootScope.$on('$locationChangeStart', function (current, previous, rejection) {
      if (!Authentication.isAuthenticated()) {
            //evt.preventDefault();           
        $location.path('/login');
        if (!$rootScope.$$phase) {
            //this will kickstart angular if to notice the change

            //$$phase is a flag set while angular is in a $digest cycle.
            //Sometimes (in rare cases), you want to check $$phase on the 
            //scope before doing an $apply. An error occurs if you try to $apply during a $digest:
            $rootScope.$apply();
        }
        else {
            $window.location = '/#/login';
        }
        delete $http.defaults.headers.common['X-Requested-With'];
        delete $http.defaults.headers.common.Authorization;
      }  
    });  
  });
/*_.mixin(_.str.exports());*/
