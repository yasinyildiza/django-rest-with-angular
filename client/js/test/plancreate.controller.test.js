describe('PlanCreateController', function () {
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
    controller = $controller('PlanCreateController', {
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

  describe('.addPlan()', function () {
    it('.addPlan() defined', function() {
      expect($scope.addPlan).toBeDefined();
    });

    it('.addPlan() success', function() {
      $scope.plan.saved = false;
      $scope.plan.id = 1;

      $scope.plan.start_datex = new Date(2017, 9, 15);
      $scope.plan.end_datex = new Date(2017, 9, 15);

      $scope.addPlan();

      expect($scope.plan.start_date).toBe('2017-10-15');
      expect($scope.plan.end_date).toBe('2017-10-15');

      expect($scope.plan.saved).toBe(true);
    });

    it('.addPlan() save error', function() {
      $scope.plan.saved = false;
      $scope.plan.id = undefined;

      $scope.plan.start_datex = new Date(2017, 9, 15);
      $scope.plan.end_datex = new Date(2017, 9, 15);

      $scope.addPlan();

      expect($scope.plan.start_date).toBe('2017-10-15');
      expect($scope.plan.end_date).toBe('2017-10-15');

      expect($scope.plan.saved).toBe(true);
    });
  });
});
