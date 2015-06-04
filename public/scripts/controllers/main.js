'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl',function($scope,$position, User) {
  	$scope.user = User.get({id:'5539b84999ec5f88076558e1'});
  });
