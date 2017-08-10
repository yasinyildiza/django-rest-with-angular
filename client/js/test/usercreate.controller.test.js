describe('UserCreateController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $state;
  var $stateParams;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$state_, _$stateParams_){
    $controller = _$controller_;
    $state = _$state_;
    $stateParams = _$stateParams_;
    $scope = {};
    controller = $controller('UserCreateController', {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
      User: MockUser
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('.user', function () {
    it('.user defined', function() {
      expect($scope.user).toBeDefined();
    });

    it('.user == new User()', function() {
      expect($scope.user).toEqual(jasmine.any(MockUser));
    });
  });

  describe('.addUser()', function () {
    it('.addUser() defined', function() {
      expect($scope.addUser).toBeDefined();
    });

    it('.addUser() success', function() {
      $scope.user.saved = false;
      $scope.user.id = 1;

      $scope.addUser();

      expect($scope.user.saved).toBe(true);
    });

    it('.addUser() save error', function() {
      $scope.user.saved = false;
      $scope.user.id = undefined;

      $scope.addUser();

      expect($scope.user.saved).toBe(true);
    });
  });
});
