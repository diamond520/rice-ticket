'use strict';
/**
 * @ngdoc overview
 * @name riceticketApp
 * @description
 * # riceticketApp
 *
 * Main module of the application.
 */
angular
  .module('riceticketApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'slick',
    'facebook',
    'duScroll',
    'bootstrapLightbox',
    'videosharing-embed',
    'seo',
    'ngDialog',
    'youtube-embed',
    'ngDfp'
  ])
  .run(['$rootScope', '$http', '$location', '$window', '$cookies', 'initService', function($rootScope, $http, $location, $window, $cookies, $initService){
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.phone() !== null && (angular.isUndefined($cookies.get('mobile')) || $cookies.get('mobile') === 'true') ){
      console.log('phone');
      var url = '';
      var domain = $location.host();
      switch(domain){
        case 'www.iset.com.tw':
          url = $location.absUrl().replace('www', 'm');
          break;
        case 'beta.iset.com.tw':
          url = $location.absUrl().replace('beta', 'm');
          break;
        case 'www.settv.com.tw':
          url = $location.absUrl().replace('www', 'm');
          break;
        default:
          url = $location.absUrl().replace(location.host, 'm.iset.com.tw');
      }

      if(url !== ''){
        url = url.replace('https://', 'http://');
        $window.location.href = url;
      }
    }
    $rootScope.apiRoot = 'http://54.178.205.166/api';
    $initService.init().then(function(){
      //console.log(response);
    }, function(){
      //console.log(response);
    });

    // $http.get($rootScope.apiRoot + '/menubarblock').then(
    //   function(response){
    //     console.log('menu completed');
    //     $initService.set('blockSort', response.data.block);
    //     $initService.set('menuBars', response.data.menubar);
    //     //$rootScope.blockSort = response.data.block;
    //     //$scope.menuBars = response.data.menubar;
    //   },
    //   function(response){
    //     console.log(response);
    //   }
    // );

  }])
  .config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ])
  .config(function(FacebookProvider) {
     // Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
     FacebookProvider.init('434600560080333');
     FacebookProvider.setLocale('zh_TW');
     FacebookProvider.setSdkVersion('v2.5');
     FacebookProvider.setXfbml(false);
     FacebookProvider.setFrictionlessRequests(true);
  })
  .config(function (DoubleClickProvider) {
    DoubleClickProvider.defineSlot('/72406903/ISET_Home_DDG_section_622x284', [600, 260], 'div-gpt-ad-1448349042187-0')
                       .defineSlot('/72406903/ISET_Drama_BottomRight_Lightbox_290x90', [270, 100], 'div-gpt-ad-1448358767455-0');
  })
  .config(function(LightboxProvider){
    LightboxProvider.templateUrl = 'views/lightboxs/showMediaLightBox.html';
  })
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/drama/:year?', {
        templateUrl: 'views/drama.html',
        controller: 'DramaCtrl',
        controllerAs: 'drama'
      })
      .when('/drama/:year/:name', {
        templateUrl: 'views/dramaDetail.html',
        controller: 'DramaDetailCtrl',
        controllerAs: 'dramaDetail'
      })
      .when('/show/:year?', {
        templateUrl: 'views/show.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
      })
      .when('/show/:year/:name', {
        templateUrl: 'views/showDetail.html',
        controller: 'ShowDetailCtrl',
        controllerAs: 'showDetail'
      })
      .when('/newsShow', {
        controller : function(){
            window.location.replace('http://www.setn.com');
        },
        template : "<div></div>"
      })
      .when('/schedule', {
        templateUrl: 'views/schedule.html',
        controller: 'ScheduleCtrl',
        controllerAs: 'schedule'
      })
      .when('/cases', {
        templateUrl: 'views/cases.html',
        controller: 'CasesCtrl',
        controllerAs: 'cases'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'events'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/privacy', {
        templateUrl: 'views/privacy.html',
        controller: 'PrivacyCtrl',
        controllerAs: 'privacy'
      })
      .when('/tvlist', {
        templateUrl: 'views/tvlist.html',
        controller: 'TvlistCtrl',
        controllerAs: 'tvlist'
      })
      .when('/mod/:channel?', {
        templateUrl: 'views/mod.html',
        controller: 'ModCtrl',
        controllerAs: 'mod'
      })
      .otherwise({
        redirectTo: '/'
      });
      var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {
          var error = function (response) {
            $http = $http || $injector.get('$http');
            console.log('error');
            return $q.reject(response);
          };
          var success = function(response) {
            $http = $http || $injector.get('$http');
            var $timeout = $injector.get('$timeout');
            var $rootScope = $injector.get('$rootScope');
            if($http.pendingRequests.length < 1) {
              $timeout(function(){
                if($http.pendingRequests.length < 1){
                  $rootScope.htmlReady();
                  console.log('html ready');
                }
              }, 1000);//an 0.7 seconds safety interval, if there are no requests for 0.7 seconds, it means that the app is through rendering
            }
            else{
              //console.log('http pendingRequests: ' + $http.pendingRequests.length);
            }
            return response;
          };

          return {
            'response': success,
            'responseError': error
          };
          // return function (promise) {
          //   return promise.then(success, error);
          // };
        }];

      $httpProvider.interceptors.push(interceptor);
  });