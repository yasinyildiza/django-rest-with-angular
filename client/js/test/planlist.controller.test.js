describe('PlanListController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $state;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$state_){
    $controller = _$controller_;
    $state = _$state_;
    $scope = {};
    controller = $controller('PlanListController', {
      $scope: $scope,
      $controller: $controller,
      $state: $state,
      Plan: MockPlan
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('check overridden scope variables', function () {
    it('.model == Plan', function() {
      expect($scope.model).toBe(MockPlan);
    });

    it('.title == Plan List', function() {
      expect($scope.title).toBe('Plan List');
    });

    it('.userfilter == true', function() {
      expect($scope.userfilter).toBe(true);
    });
  });
});
