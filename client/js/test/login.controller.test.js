describe('LoginController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $http;
  var $httpBackend;
  var $window;
  var $rootScope;
  var $state;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$http_, _$httpBackend_, _$window_, _$rootScope_, _$state_){
    $controller = _$controller_;
    $http = _$http_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $scope = _$rootScope_.$new();

    $window.localStorage.setItem('travel-auth-username', '');
    $window.localStorage.setItem('travel-auth-token', '');

    controller = $controller('LoginController', {
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

  describe('.login()', function () {
    beforeEach(function() {
      $window.localStorage.setItem('travel-auth-username', '');
      $window.localStorage.setItem('travel-auth-token', '');
    });

    it('should be defined', function() {
      expect($scope.login).toBeDefined();
    });

    it('should get and save auth-token successfully', function() {
      var username = 'testuser';
      var password = 'testpass';
      var token = 'testtoken';

      $httpBackend.expectPOST(
        'http://localhost:8000/v1/api-token-auth/',
        {username: username, password: password })
      .respond(200, {token: token});

      $scope.username = username;
      $scope.password = password;
      $scope.login();

      $httpBackend.flush();

      expect($window.localStorage.getItem('travel-auth-username')).toBe(username);
      expect($window.localStorage.getItem('travel-auth-token')).toBe(token);
      expect($http.defaults.headers.common['Authorization']).toBe('Token ' + token);
      expect($rootScope.authToken).toBe(token);
      expect($rootScope.authUsername).toBe(username);
      expect($rootScope.loggedIn).toBe(true);
    });

    afterEach(inject(function($httpBackend){
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));
  });
});
