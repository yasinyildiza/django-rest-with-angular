describe('UserEditController', function () {
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
    controller = $controller('UserEditController', {
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

  describe('.updateUser()', function () {
    it('.updateUser() defined', function() {
      expect($scope.updateUser).toBeDefined();
    });

    it('.updateUser() success', function() {
      $scope.user.updated = false;
      MockUser.updateResponse = undefined;

      $scope.updateUser();

      expect($scope.user.updated).toBe(true);
    });

    it('.updateUser() save error', function() {
      $scope.user.updated = false;
      MockUser.updateResponse = null;

      $scope.updateUser();

      expect($scope.user.updated).toBe(true);
    });
  });
});
