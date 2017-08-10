describe('UserListController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $state;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_, _$state_){
    $controller = _$controller_;
    $state = _$state_;
    $scope = {};
    controller = $controller('UserListController', {
      $scope: $scope,
      $controller: $controller,
      $state: $state,
      User: MockUser
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('check overridden scope variables', function () {
    it('.model == User', function() {
      expect($scope.model).toBe(MockUser);
    });

    it('.title == User List', function() {
      expect($scope.title).toBe('User List');
    });

    it('.header == templates/user/header.html', function() {
      expect($scope.header).toBe('templates/user/header.html');
    });

    it('.row == templates/user/row.html', function() {
      expect($scope.row).toBe('templates/user/row.html');
    });

    it('.ordering == id', function() {
      expect($scope.ordering).toBe('id');
    });

    it('.ascending == true', function() {
      expect($scope.ascending).toBe(true);
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
