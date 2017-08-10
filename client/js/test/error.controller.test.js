describe('ErrorController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $scope;
  var $stateParams;
  var controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
    $scope = {};
    $stateParams = {response: 'this is a response'};
    controller = $controller('ErrorController', {
      $scope: $scope,
      $stateParams, $stateParams
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('.response', function () {
    it('get response from $stateParams', function() {
      expect($scope.response).toBe($stateParams.response);
    });
  });
});
