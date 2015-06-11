'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ChartCtrl', ['$scope', '$timeout', 'Charts', function ($scope, $timeout) {
    

    $scope.bar = {
	    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
		series: ['Miembros', 'Mensajes'],
		data: [
		   [65, 59, 80, 81, 56, 55, 40],
		   [28, 48, 40, 19, 86, 27, 90]
		],
        toggle : function () {
            //this.data = Charts.get({name:})
            this.data[0][0] = this.data[0][0] + 10;
        }
    };

    setTimeout(function(){
        $scope.bar.toggle()
    }, 1000)




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
}])
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

