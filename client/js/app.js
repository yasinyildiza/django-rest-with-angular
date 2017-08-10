var app = angular.module('travel', ['ui.router', 'ngResource']);

app.config(function($stateProvider, $httpProvider) {
    $stateProvider.state('errorUrl',{
        url: '/error',
        templateUrl: 'templates/error.html',
        controller: 'ErrorController',
        params: {'response': null},
    }).state('listPlanUrl',{
        url: '/plans',
        templateUrl: 'templates/list.html',
        controller: 'PlanListController'
    }).state('detailPlanUrl', {
        url: '/plans/:id/detail',
        templateUrl: 'templates/plan/detail.html',
        controller: 'PlanDetailController'
    }).state('newPlanUrl', {
        url: '/plans/new',
        templateUrl: 'templates/plan/new.html',
        controller: 'PlanCreateController'
    }).state('editPlanUrl', {
        url: '/plans/:id/edit',
        templateUrl: 'templates/plan/edit.html',
        controller: 'PlanEditController'
    }).state('listUserUrl', {
        url: '/users',
        templateUrl: 'templates/list.html',
        controller: 'UserListController'
    }).state('detailUserUrl', {
        url: '/users/:id/detail',
        templateUrl: 'templates/user/detail.html',
        controller: 'UserDetailController'
    }).state('newUserUrl', {
        url: '/users/new',
        templateUrl: 'templates/user/new.html',
        controller: 'UserCreateController'
    }).state('editUserUrl', {
        url: '/users/:id/edit',
        templateUrl: 'templates/user/edit.html',
        controller: 'UserEditController'
    }).state('loginUrl', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    }).state('logoutUrl', {
        url: '/logout',
        //templateUrl: 'templates/logout.html',
        controller: 'LogoutController'
    }).state('myPlanListUrl', {
        url: '/myplans',
        templateUrl: 'templates/list.html',
        controller: 'MyPlanListController'
    });

    $httpProvider.interceptors.push(interceptHttp);
     
    function interceptHttp($q, $state) {

        function errorHandler(response) {
            return $state.go('errorUrl', {response: response});
        }

        function requestError(response) {
            return errorHandler(response);
        }

        function responseError(response) {
            return errorHandler(response);
        }

        return({
            requestError: requestError,
            responseError: responseError
        });
    }
});

app.run(function($state, $window, $rootScope, $http) {
    var authToken = $window.localStorage.getItem('travel-auth-token');
    var authUsername = $window.localStorage.getItem('travel-auth-username');
    if(authToken != null && authToken.length > 0) {
        $http.defaults.headers.common['Authorization'] = 'Token ' + authToken;
        $rootScope.authToken = authToken;
        $rootScope.authUsername = authUsername;
        $rootScope.loggedIn = true;
        $state.go('listPlanUrl');
    } else {
        $http.defaults.headers.common['Authorization'] = '';
        $rootScope.authToken = '';
        $rootScope.authUsername = '';
        $rootScope.loggedIn = false;
        $state.go('loginUrl');
    }
});
