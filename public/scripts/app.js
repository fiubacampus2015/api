'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngResource',
    'ngRoute'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider', '$resourceProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider, $resourceProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/controllers/main.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                })
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      .state('login',{
        controller: 'UserCtrl',
        templateUrl:'views/pages/login.html',
        url:'/login',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/user.js']
            })
          }
        }
    })
      .state('dashboard.chart_topten',{
        templateUrl:'views/chart.html',
        url:'/chart/:to/:from',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.chart_careers',{
        templateUrl:'views/careers.html',
        url:'/chart/careers',
        controller:'ChartCareersCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.chart_user',{
        templateUrl:'views/chart_users.html',
        url:'/statistics',
        controller:'ChartUsersCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.groups',{
        templateUrl:'views/groups.html',
        url:'/groups'
    })
      .state('dashboard.users',{
        templateUrl:'views/users.html',
        url:'/users'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
  }])
  .run(['$rootScope', '$state', '$stateParams','$location',
    function($rootScope, $state, $stateParams, $location) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        var login = localStorage.getItem('login');
        console.log("login", login)
        if(!login) {
          return $location.path("login"); 
        };
        

        // track the state the user wants to go to; authorization service needs this
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        // if the principal is resolved, do an authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        //if (principal.isIdentityResolved()) authorization.authorize();
      });
    }
  ])
  .factory('User', ['$resource', function($resource) { return  $resource('/api/users/:id', {id:'@_id'}, {
      'update': { method:'PUT' } ,
      'authenticate': {
            method: 'POST', url: '/api/users/:id/authenticate'
        },
    });  
  }])
  .factory('Group', ['$resource', function($resource) { return  $resource('/api/groups/:id', {id:'@_id'}, {'update': { method:'PUT' } });  }])
  .factory('Forum', ['$resource', function($resource) { return  $resource('/api/forums/:id', {id:'@_id'}, {'update': { method:'PUT' } });  }])
  .factory('Chart', ['$resource', function($resource) { return  $resource('/api/charts/:id', {id:'@_id'});  }])
  ;