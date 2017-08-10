var RECORD_COUNT = 15;

var mockPopupService = {};
mockPopupService.confirmed = false;
mockPopupService.showPopup = function() {
    return this.confirmed;
}

var MockPlan = function() {
	this.saved = false;
	this.updated = false;
	this.deleted = false;

	this.$save = function(callback) {
		callback(MockPlan.saveResponse);
        this.saved = true;
        return MockPlan.saveResponse;
	}

	this.$update = function(callback) {
		callback(MockPlan.updateResponse);
        this.updated = true;
        return MockPlan.updateResponse;
	}

	this.$delete = function(callback) {
		callback();
        this.deleted = true;
	}

	this.id = null;
    this.user = null;
    this.destination = null;
    this.comment = null;
    this.start_date = null;
    this.end_date = null;
    this.start_datex = null;
    this.end_datex = null;
    this.created_at = null;
    this.updated_at = null;
}

MockPlan.query = function(params, callback) {
	results = [];
	for(var i=0; i<RECORD_COUNT; i++) {
		results.push(new MockPlan());
	}
	return {
		count: results.length,
		results: results
	};
}

MockPlan.get = function(params, callback) {
	return new MockPlan();
}

MockPlan.saveResponse = null;
MockPlan.updateResponse = null;

var MockUser = function() {
    this.saved = false;
    this.updated = false;
    this.deleted = false;

    this.$save = function(callback) {
        callback(MockUser.saveResponse);
        this.saved = true;
        return MockUser.saveResponse;
    }

    this.$update = function(callback) {
        callback(MockUser.updateResponse);
        this.updated = true;
        return MockUser.updateResponse;
    }

    this.$delete = function(callback) {
        callback();
        this.deleted = true;
    }

    this.id = null;
    this.username = null;
    this.email = null;
}

MockUser.query = function(params, callback) {
    results = [];
    for(var i=0; i<RECORD_COUNT; i++) {
        results.push(new MockUser());
    }
    return {
        count: results.length,
        results: results
    };
}

MockUser.get = function(params) {
    return new MockUser();
}

MockUser.saveResponse = null;
MockUser.updateResponse = null;
