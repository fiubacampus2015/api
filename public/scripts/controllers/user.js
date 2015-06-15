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


    //if(localStorage.getItem('login')) return $location.path("/");

  	$scope.authenticate = function() {
      User.authenticate({email:$scope.user.email, password: $scope.user.password}, function(respo){
        localStorage.setItem('login', true)
        
      }, function(err){
        localStorage.removeItem('login')
      });
  	}
  });
