'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$position, User, Group, Forum, Chart) {
  	
    $scope.user = User.get({id:'55723a0c7f42365c134c4eef'});
    console.log("VAMO: ", $scope.user)

  	var groups = Group.query(function(){
      $scope.forums_search = {};
      $scope.group_selec = groups[0];
      $scope.forums_search.group = $scope.group_selec._id;
  		$scope.groups = groups;
  	});

  	var forums = Forum.query(function(){
  		$scope.forums = forums;
  	});

  	var users = User.query(function(){
  		$scope.users = users;
  	});


    $scope.entity_suspend = function(entity) {
      entity.suspend = true;
      entity.$update();
    };

    $scope.entity_active = function(entity) {
      entity.suspend = false;
      entity.$update();
    };

  });
