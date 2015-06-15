'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ChartCtrl', function ($scope,$location,$stateParams, $timeout, Chart, $window) {
    
    $scope.filter = {
        to: '',
        from: ''
    };

//$location.path('dashboard/statistics');
if ($stateParams)
    console.log($stateParams);

    $scope.bar = {
        labels : [],
        data : [[]]
    };

    $scope.doCall = function() {

        if ($stateParams.to != null && $stateParams.to != '' && $stateParams.to != '0')
        {
            $scope.filter.to = $stateParams.to;
            $scope.filter.from = $stateParams.from;
        }

        $scope.bar = Chart.get({id:'active_user', to: decodeURIComponent($scope.filter.to), from: decodeURIComponent($scope.filter.from)});
    }

    $scope.doCallRefresh = function() {
    
        $location.path('/dashboard/chart/' +encodeURIComponent($scope.filter.to)+ '/' +encodeURIComponent($scope.filter.from) );
    }

    /*
    setInterval(function(){
        $scope.doCall();
    }, 10000);
    */
    $scope.doCall();

    $scope.imprimir = function() {
        $window.print();
    }


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
.controller('ChartUsersCtrl', function ($scope, $timeout, Chart, $window) {

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

    $scope.imprimir = function() {
        $window.print();
    }

})
.controller('ChartCareersCtrl', function ($scope, $timeout, Chart, $window) {


    $scope.pie = {
        labels : [],
        data : []
    };

    $scope.doCall = function() {
        $scope.pie = Chart.get({id:'career'});
    }

    setInterval(function(){
        $scope.doCall();
    }, 30000);


    $scope.imprimir = function() {
        $window.print();
    }


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


