describe('ListController', function () {
  beforeEach(angular.mock.module('travel'));

  var $controller;
  var $q;
  var $scope;
  var controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
    $scope = {};
    controller = $controller('ListController', {
      $scope: $scope
    });
  }));

  describe('should exist', function () {
    it('controller should be defined', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('check scope variables', function () {
    it('.page == 1', function() {
      expect($scope.page).toBe(1);
    });

    it('.size == 10', function() {
      expect($scope.size).toBe(10);
    });

    it('.params == {}', function() {
      expect($scope.params).toEqual({});
    });

    it('.npp_list == [10, 20, 50, 100]', function() {
      expect($scope.npp_list).toEqual([10, 20, 50, 100]);
    });

    it('.model defined', function() {
      expect($scope.model).toBeDefined();
    });

    it('.records defined', function() {
      expect($scope.records).toBeDefined();
    });

    it('.title defined', function() {
      expect($scope.title).toBeDefined();
    });

    it('.header defined', function() {
      expect($scope.header).toBeDefined();
    });

    it('.row defined', function() {
      expect($scope.row).toBeDefined();
    });

    it('.search defined', function() {
      expect($scope.search).toBeDefined();
    });

    it('.ordering defined', function() {
      expect($scope.ordering).toBeDefined();
    });

    it('.ascending defined', function() {
      expect($scope.ascending).toBeDefined();
    });
  });

  describe('check scope methods', function () {
    it('.load() defined', function() {
      expect($scope.load).toBeDefined();
    });

    it('.prev() defined', function() {
      expect($scope.prev).toBeDefined();
    });

    it('.next() defined', function() {
      expect($scope.next).toBeDefined();
    });

    it('.first() defined', function() {
      expect($scope.first).toBeDefined();
    });

    it('.last() defined', function() {
      expect($scope.last).toBeDefined();
    });

    it('.setSize(size) defined', function() {
      expect($scope.setSize).toBeDefined();
    });

    it('.toggleAscending() defined', function() {
      expect($scope.toggleAscending).toBeDefined();
    });

    it('.setOrdering(ordering) defined', function() {
      expect($scope.setOrdering).toBeDefined();
    });

    it('.range(min, max, step) defined', function() {
      expect($scope.range).toBeDefined();
    });
  });

  describe('.load()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    // TODO
  });

  describe('.prev()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.page should decrease by one', function() {
      $scope.page = 12;
      $scope.prev();

      expect($scope.page).toBe(11);
    });

    it('.page should not decrease for the first page', function() {
      $scope.page = 1;
      $scope.prev();

      expect($scope.page).toBe(1);
    });
  });

  describe('.next()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.page should increase by one', function() {
      $scope.page = 12;
      $scope.pcount = 20;
      $scope.next();

      expect($scope.page).toBe(13);
    });

    it('.page should not increase for the last page', function() {
      $scope.page = 12;
      $scope.pcount = 12;
      $scope.next();

      expect($scope.page).toBe(12);
    });
  });

  describe('.first()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.page should be set to 1', function() {
      $scope.page = 12;
      $scope.first();

      expect($scope.page).toBe(1);
    });
  });

  describe('.last()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.page should be set to .pcount', function() {
      $scope.page = 12;
      $scope.pcount = 20;
      $scope.last();

      expect($scope.page).toBe(20);
    });
  });

  describe('.setSize(size)', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.size should be set to argument', function() {
      $scope.size = 12;
      $scope.setSize(20);

      expect($scope.size).toBe(20);
    });

    it('.size should be kept for non-positive arguments', function() {
      $scope.size = 12;
      $scope.setSize(0);

      expect($scope.size).toBe(12);
    });
  });

  describe('.toggleAscending()', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.ascending true => false', function() {
      $scope.ascending = true;
      $scope.toggleAscending();

      expect($scope.ascending).toBe(false);
    });

    it('.ascending false => true', function() {
      $scope.ascending = false;
      $scope.toggleAscending();

      expect($scope.ascending).toBe(true);
    });
  });

  describe('.setOrdering(ordering)', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('.ordering should be set to argument, .ascending should not change', function() {
      $scope.ordering = "field1";
      $scope.ascending = true;
      $scope.setOrdering("field2");

      expect($scope.ordering).toBe("field2");
      expect($scope.ascending).toBe(true);
    });

    it('.ordering same withthe argument, .ascending should toggle', function() {
      $scope.ordering = "field1";
      $scope.ascending = true;
      $scope.setOrdering("field1");

      expect($scope.ordering).toBe("field1");
      expect($scope.ascending).toBe(false);
    });
  });

  describe('.range(min, max, step)', function () {
    beforeEach(function() {
      $scope.model = MockPlan;
    });

    it('returns an array corresponding to a closed range for the arguments', function() {
      expect($scope.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
    });

    it('step argument is optional (default: 1)', function() {
      expect($scope.range(0, 4)).toEqual([0, 1, 2, 3, 4]);
    });

    it('returns empty array if min > max', function() {
      expect($scope.range(7, 5)).toEqual([]);
    });
  });
});
