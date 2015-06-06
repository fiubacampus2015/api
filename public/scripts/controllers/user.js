'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('UserCtrl',function($scope,$position, User, $http) {
  	$scope.user = {
  		email: '',
  		password:''
  	};

  	$scope.puto = 'a'
  	$scope.password = 'b'


  	console.log("USER")

  	$scope.authenticate = function() {
  		console.log("VAMOOOO")
  		console.log($scope.user);
  	}
  });
