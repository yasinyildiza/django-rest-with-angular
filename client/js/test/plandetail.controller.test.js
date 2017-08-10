describe('PlanDetailController', function () {
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
    controller = $controller('PlanDetailController', {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
      popupService: mockPopupService,
      Plan: MockPlan
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('.plan', function () {
    it('.plan defined', function() {
      expect($scope.plan).toBeDefined();
    });

    it('.plan == Plan.get()', function() {
      expect($scope.plan).toEqual(jasmine.any(MockPlan));
    });
  });

  describe('.deletePlan(plan)', function () {
    it('.deletePlan(plan) defined', function() {
      expect($scope.deletePlan).toBeDefined();
    });

    it('.deletePlan(plan) should delete instance if pop-up confirmed', function() {
      mockPopupService.confirmed = true;
      var plan = new MockPlan();
      plan.deleted = false;

      $scope.deletePlan(plan);

      expect(plan.deleted).toBe(true);
    });

    it('.deletePlan(plan) should not delete instance if pop-up not confirmed', function() {
      mockPopupService.confirmed = false;
      var plan = new MockPlan();
      plan.deleted = false;

      $scope.deletePlan(plan);

      expect(plan.deleted).toBe(false);
    });
  });
});
