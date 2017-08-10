describe('BasePlanListController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
    $scope = {};
    controller = $controller('BasePlanListController', {
      $scope: $scope,
      $controller: $controller
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('check overridden scope variables', function () {
    it('.header == templates/plan/header.html', function() {
      expect($scope.header).toBe('templates/plan/header.html');
    });

    it('.row == templates/plan/row.html', function() {
      expect($scope.row).toBe('templates/plan/row.html');
    });

    it('.ordering == id', function() {
      expect($scope.ordering).toBe('id');
    });

    it('.ascending == true', function() {
      expect($scope.ascending).toBe(true);
    });

    it('.userfilter defined', function() {
      expect($scope.userfilter).toBeDefined();
    });

    it('.sortables == [{name: "name", title: "title"}]', function() {
      $scope.sortables.forEach(function(sortable) {
        expect(sortable.name).toBeDefined();
        expect(sortable.title).toBeDefined();
      });
    });

    it('.params default empty for each param', function() {
      Object.keys($scope.params).forEach(function(param) {
        expect($scope.params[param]).toBe('');
      });
    });
  });
});
