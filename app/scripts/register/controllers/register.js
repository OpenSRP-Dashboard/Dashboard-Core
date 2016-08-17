'use strict';

angular.module('opensrpSiteApp')
   .controller('RegisterCtrl', function ($scope,$rootScope, $location, $http, $window,$timeout, Register) {
        Register.getData($scope);
    });
