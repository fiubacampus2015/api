'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ChartCtrl', function ($scope, $timeout, Chart) {
    
    $scope.filter = {
        to:'',
        from:''
    };

    $scope.bar = {
        labels : [],
        data : []
    };

    $scope.doCall = function() {
        $scope.bar = Chart.get({id:'active_user', to:$scope.filter.to, from:$scope.filter.from}); 
    }

    /*
    setInterval(function(){
        $scope.doCall();
    }, 10000);
    */
    $scope.doCall();


    /*
    $scope.donut = {
    	labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data: [300, 500, 100]
    };

    $scope.radar = {
    	labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],

    	data:[
    	    [100, 10, 10, 10, 100, 10, 100],
    	]
    };

    $scope.pie = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data : [300, 500, 100]
    };

    $scope.polar = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120]
    };

    $scope.dynamic = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120],
    	type : 'PolarArea',

    	toggle : function () 
    	{
    		this.type = this.type === 'PolarArea' ?
    	    'Pie' : 'PolarArea';
		}
    };*/
})
.controller('ChartUsersCtrl', function ($scope, $timeout, Chart) {

    $scope.line = {
        labels : [],
        data : []
    };

    $scope.doCall = function() {
        $scope.line = Chart.get({id:'topten'});
        $scope.line.onClick = function (points, evt) {
          console.log(points, evt);
        }
    }

    /*
    setInterval(function(){
        $scope.doCall();
    }, 10000);
    */
    $scope.doCall();



})
.controller('ChartCareersCtrl', function ($scope, $timeout, Chart) {


    $scope.pie = {
        labels : [],
        data : []
    };

    $scope.doCall = function() {
        $scope.pie = Chart.get({id:'career'});
    }

    setInterval(function(){
        $scope.doCall();
    }, 10000);

    $scope.doCall();
})
.directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {

        }
    };
})
;


