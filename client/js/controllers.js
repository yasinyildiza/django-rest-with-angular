function string2date(string) {
    var s = string.split('-');
    var year = parseInt(s[0]);
    var month = parseInt(s[1])-1;
    var day = parseInt(s[2]);
    return new Date(year, month, day);
}

function date2string(date) {
    var year = (date.getYear()+1900).toString();
    var month = (date.getMonth()+1).toString();
    var day = (date.getDate()).toString();

    month = month.length == 1 ? '0' + month : month;
    day = day.length == 1 ? '0' + day : day;

    return year + '-' + month + '-' + day;
}

var app = angular.module('travel');

app.controller('ErrorController', function($scope, $stateParams) {
    $scope.response = $stateParams.response;
});

app.controller('LoginController', function($window, $rootScope, $scope, $state, $http){
    $scope.username = '';
    $scope.password = '';

    $scope.login = function() {
        $http.post('http://localhost:8000/v1/api-token-auth/', {
            username: $scope.username,
            password: $scope.password}
        ).then(function(data, status, headers) {
            if(data.url != '/error') {
                var authToken = data.data.token;
                var authUsername = $scope.username
                $window.localStorage.setItem('travel-auth-username', authUsername);
                $window.localStorage.setItem('travel-auth-token', authToken);
                $http.defaults.headers.common['Authorization'] = 'Token ' + authToken;
                $rootScope.authToken = authToken;
                $rootScope.authUsername = authUsername;
                $rootScope.loggedIn = true;
                $state.go('listPlanUrl');
            }
        });
    }
});

app.controller('LogoutController', function($window, $rootScope, $scope, $state, $http){
    $window.localStorage.setItem('travel-auth-username', '');
    $window.localStorage.setItem('travel-auth-token', '');
    $http.defaults.headers.common['Authorization'] = '';
    $rootScope.authToken = '';
    $rootScope.authUsername = '';
    $rootScope.loggedIn = false;
    $state.go('loginUrl');
});

app.controller('ListController', function($scope) {
    $scope.load = function() {
        $scope.data = $scope.model.query(
            $.extend(
                {},
                {page: $scope.page},
                {size: $scope.size},
                {ordering: ($scope.ascending ? '' : '-') + $scope.ordering},
                $scope.params
            ),
            function() {
                $scope.records = $scope.data.results;
                $scope.rcount = $scope.data.count
                $scope.pcount = Math.ceil($scope.rcount / $scope.size);
            }
        );
    }

    $scope.prev = function() {
        if($scope.page > 1) {
            $scope.page -= 1;
        }
        $scope.load();
    }

    $scope.next = function() {
        if($scope.page < $scope.pcount) {
            $scope.page += 1;
        }
        $scope.load();
    }

    $scope.first = function() {
        $scope.page = 1;
        $scope.load();
    }

    $scope.last = function() {
        $scope.page = $scope.pcount;
        $scope.load();
    }

    $scope.setSize = function(size) {
        if(size > 0) {
            $scope.size = size;
        }
        $scope.load();
    }

    $scope.toggleAscending = function() {
        $scope.ascending = !$scope.ascending;
    }

    $scope.setOrdering = function(ordering) {
        if($scope.ordering == ordering) {
            $scope.toggleAscending();
        }
        $scope.ordering = ordering;
        $scope.load();
    }

    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for(var i=min; i<=max; i+=step) {
            input.push(i);
        }
        return input;
    }

    $scope.page = 1;
    $scope.size = 10;
    $scope.params = {};
    $scope.npp_list = [10, 20, 50, 100];

    $scope.records = null;

    $scope.model = null;
    $scope.title = null;
    $scope.header = null;
    $scope.row = null;
    $scope.search = null;
    $scope.ordering = null;
    $scope.ascending = null;
})

app.controller('BasePlanListController', function($scope, $controller) {
    $controller('ListController', {$scope: $scope});

    $scope.header = 'templates/plan/header.html';
    $scope.row = 'templates/plan/row.html';
    $scope.search = 'templates/plan/search.html';
    $scope.ordering = 'id';
    $scope.ascending = true;

    $scope.userfilter = null;

    $scope.sortables = [
        {name: 'id', title: 'ID'},
        {name: 'user', title: 'User'},
        {name: 'destination', title: 'Destination'},
        {name: 'comment', title: 'Comment'},
        {name: 'start_date', title: 'Start date'},
        {name: 'end_date', title: 'End date'},
        {name: 'created_at', title: 'Created at'},
        {name: 'updated_at', title: 'Updated at'}
    ];
    
    $scope.params = {
        user: '',
        destination: '',
        comment: '',
        start_date_min: '',
        start_date_max: '',
        end_date_min: '',
        end_date_max: ''
    };
})

app.controller('MyPlanListController', function($scope, $controller, $state, MyPlan) {
    $controller('BasePlanListController', {$scope: $scope, $controller: $controller});

    $scope.model = MyPlan;
    $scope.title = 'Next Month Plan List';
    $scope.userfilter = false;

    $scope.load();
})

app.controller('PlanListController', function($scope, $controller, $state, Plan) {
    $controller('BasePlanListController', {$scope: $scope, $controller: $controller});

    $scope.model = Plan;
    $scope.title = 'Plan List';
    $scope.userfilter = true;

    $scope.load();
})

app.controller('PlanDetailController', function($scope, $state, $stateParams, popupService, Plan) {
    $scope.plan = Plan.get({id: $stateParams.id});

    $scope.deletePlan = function(plan) {
        if(popupService.showPopup('Really delete this?')) {
            plan.$delete(function() {
                $state.go('listPlanUrl');
            });
        }
    }
})

app.controller('PlanCreateController', function($scope, $state, $stateParams, Plan) {
    $scope.plan = new Plan();

    $scope.addPlan = function() {
        $scope.plan.start_date = date2string($scope.plan.start_datex);
        $scope.plan.end_date = date2string($scope.plan.end_datex);

        $scope.plan.$save(function() {
            if($scope.plan.id !== undefined) {
                $state.go('detailPlanUrl', {'id': $scope.plan.id});
            }
        });
    }
})

app.controller('PlanEditController', function($scope, $state, $stateParams, Plan){
    $scope.plan = Plan.get({id: $stateParams.id}, function() {
        $scope.plan.start_datex = string2date($scope.plan.start_date);
        $scope.plan.end_datex = string2date($scope.plan.end_date);
    });

    $scope.updatePlan = function() {
        $scope.plan.start_date = date2string($scope.plan.start_datex);
        $scope.plan.end_date = date2string($scope.plan.end_datex);

        $scope.plan.$update(function(response) {
            if(response === undefined) {
                $state.go('detailPlanUrl', {'id': $scope.plan.id});
            }
        });
    };
})

app.controller('UserListController', function($scope, $controller, $state, User) {
    $controller('ListController', {$scope: $scope});

    $scope.model = User;
    $scope.title = 'User List';
    $scope.header = 'templates/user/header.html';
    $scope.row = 'templates/user/row.html';
    $scope.search = 'templates/user/search.html';
    $scope.ordering = 'id';
    $scope.ascending = true;

    $scope.sortables = [
        {name: 'id', title: 'ID'},
        {name: 'username', title: 'Username'},
        {name: 'email', title: 'Email'}
    ];

    $scope.params = {
        username: '',
        email: ''
    };
    
    $scope.load();
})

app.controller('UserDetailController', function($scope, $state, $stateParams, popupService, User) {
    $scope.user = User.get({id: $stateParams.id});

    $scope.deleteUser = function(user) {
        if(popupService.showPopup('Really delete this?')) {
            user.$delete(function() {
                $state.go('listUserUrl');
            });
        }
    }
})

app.controller('UserCreateController', function($scope, $state, $stateParams, User) {
    $scope.user = new User();

    $scope.addUser = function() {
        $scope.user.$save(function(response) {
            if($scope.user.id !== undefined) {
                $state.go('loginUrl');
            }
        });
    }
})

app.controller('UserEditController', function($scope, $state, $stateParams, User){
    $scope.user = User.get({id: $stateParams.id});

    $scope.updateUser = function() {
        $scope.user.$update(function(response) {
            if(response === undefined) {
                $state.go('detailUserUrl', {'id': $scope.user.id});
            }
        });
    };
});
