'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('UserCtrl',function($scope,$position, User) {
  	$scope.user = User.get({token: '554fed700afb650300427d42', id:'5539b84999ec5f88076558e1'});
  	console.log("VAMO: ", $scope.user)
  });
