describe('LogoutController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $http;
  var $window;
  var $rootScope;
  var $state;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$http_, _$window_, _$rootScope_, _$state_){
    $controller = _$controller_;
    $http = _$http_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $scope = _$rootScope_.$new();

    $window.localStorage.setItem('travel-auth-username', 'testuser');
    $window.localStorage.setItem('travel-auth-token', 'testtoken');

    controller = $controller('LogoutController', {
      $http: $http,
      $window: $window,
      $rootScope: $rootScope,
      $state: $state,
      $scope: $scope
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('action', function () {
    it('should remove auth-token', function() {
      expect($window.localStorage.getItem('travel-auth-username')).toBe('');
      expect($window.localStorage.getItem('travel-auth-token')).toBe('');
      expect($http.defaults.headers.common['Authorization']).toBe('');
      expect($rootScope.authToken).toBe('');
      expect($rootScope.authUsername).toBe('');
      expect($rootScope.loggedIn).toBe(false);
    });
  });
});
