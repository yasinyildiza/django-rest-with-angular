describe('UserDetailController', function () {
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
    controller = $controller('UserDetailController', {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
      popupService: mockPopupService,
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

    it('.user == User.get()', function() {
      expect($scope.user).toEqual(jasmine.any(MockUser));
    });
  });

  describe('.deleteUser(user)', function () {
    it('.deleteUser(user) defined', function() {
      expect($scope.deleteUser).toBeDefined();
    });

    it('.deleteUser(user) should delete instance if pop-up confirmed', function() {
      mockPopupService.confirmed = true;
      var user = new MockUser();
      user.deleted = false;

      $scope.deleteUser(user);

      expect(user.deleted).toBe(true);
    });

    it('.deleteUser(user) should not delete instance if pop-up not confirmed', function() {
      mockPopupService.confirmed = false;
      var user = new MockUser();
      user.deleted = false;

      $scope.deleteUser(user);

      expect(user.deleted).toBe(false);
    });
  });
});
