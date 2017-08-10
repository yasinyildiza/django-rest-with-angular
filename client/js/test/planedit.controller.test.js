describe('PlanEditController', function () {
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
    controller = $controller('PlanEditController', {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
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

    it('.plan == new Plan()', function() {
      expect($scope.plan).toEqual(jasmine.any(MockPlan));
    });
  });

  describe('.updatePlan()', function () {
    it('.updatePlan() defined', function() {
      expect($scope.updatePlan).toBeDefined();
    });

    it('.updatePlan() success', function() {
      $scope.plan.updated = false;
      MockPlan.updateResponse = undefined;

      $scope.plan.start_datex = new Date(2017, 9, 15);
      $scope.plan.end_datex = new Date(2017, 9, 15);

      $scope.updatePlan();

      expect($scope.plan.start_date).toBe('2017-10-15');
      expect($scope.plan.end_date).toBe('2017-10-15');

      expect($scope.plan.updated).toBe(true);
    });

    it('.updatePlan() save error', function() {
      $scope.plan.updated = false;
      MockPlan.updateResponse = null;

      $scope.plan.start_datex = new Date(2017, 9, 15);
      $scope.plan.end_datex = new Date(2017, 9, 15);

      $scope.updatePlan();

      expect($scope.plan.start_date).toBe('2017-10-15');
      expect($scope.plan.end_date).toBe('2017-10-15');

      expect($scope.plan.updated).toBe(true);
    });
  });
});
