describe('MyPlanListController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $state;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$state_){
    $controller = _$controller_;
    $state = _$state_;
    $scope = {};
    controller = $controller('MyPlanListController', {
      $scope: $scope,
      $controller: $controller,
      $state: $state,
      MyPlan: MockPlan
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('check overridden scope variables', function () {
    it('.model == MyPlan', function() {
      expect($scope.model).toBe(MockPlan);
    });

    it('.title == Next Month Plan List', function() {
      expect($scope.title).toBe('Next Month Plan List');
    });

    it('.userfilter == false', function() {
      expect($scope.userfilter).toBe(false);
    });
  });
});
