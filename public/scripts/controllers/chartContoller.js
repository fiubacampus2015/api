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
    

    $scope.bar = {
        labels : [],
        data : []
    };

    $scope.doCall = function() {
        $scope.bar = Chart.get({id:'topten'}); 
    }

    setInterval(function(){
        $scope.doCall();
    }, 10000);

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
;

