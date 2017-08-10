function handleResponse(response) {
    if(response.url == '/error') {
        return response;
    }
}

var app = angular.module('travel');

app.factory('MyPlan', function($resource) {
    return $resource('http://localhost:8000/v1/mytravelplans.json', {}, {
        'query': {
            method: 'GET'
        }
    });
});

app.factory('Plan', function($resource) {
    return $resource('http://localhost:8000/v1/travelplans/:id.json', {id: '@id'}, {
        'query': {
            method: 'GET'
        },
        'create': {
            method: 'POST',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        },
        'get': {
            method: 'GET'
        },
        'update': {
            method: 'PUT',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        },
        'delete': {
            method: 'DELETE',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        }
    });
});

app.factory('User', function($resource) {
    return $resource('http://localhost:8000/v1/users/:id.json', {id: '@id'}, {
        'query': {
            method: 'GET'
        },
        'create': {
            method: 'POST',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        },
        'get': {
            method: 'GET'
        },
        'update': {
            method: 'PUT',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        },
        'delete': {
            method: 'DELETE',
            interceptor : {
                response: handleResponse,
                responseError : handleResponse
            }
        }
    });
});

app.service('popupService', function($window) {
    this.showPopup = function(message) {
        return $window.confirm(message);
    }
});
