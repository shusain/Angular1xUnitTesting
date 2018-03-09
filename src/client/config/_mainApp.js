(function() {
  angular.module('myApp', [ 'ui.router' ]).config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $stateProvider.state({
      name: 'defaultState',
      url: '/default',
      templateUrl: 'defaultPage.html',
      controller: 'MainCtrl',
      controllerAs: 'mctl'
    });

    $urlRouterProvider.otherwise('/default');
  });
})();
