'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('UserCtrl',function($scope,$position, User, $http, $location) {
  	$scope.user = {
  		email: '',
  		password:''
  	};

  	$scope.puto = 'a'
  	$scope.password = 'b'

    $scope.showErrors = '';
  	
    //if(localStorage.getItem('login')) return $location.path("/");

  	$scope.authenticate = function() {
      User.authenticate({email:$scope.user.email, password: $scope.user.password}, function(respo){
        localStorage.setItem('login', true);
        $location.path("/");
        $scope.showErrors = '';
      }, function(err){
        $scope.showErrors = true;
        localStorage.removeItem('login')
      });
  	}
  });
