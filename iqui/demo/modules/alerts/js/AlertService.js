/// <reference path="../../../types/types.d.ts" />
define(["require", "exports", './Alert'], function (require, exports, Alert) {
    var _data = [];
    var _dict = {
        users: ["John Snow", "Al Pacino", "Jenna Jameson"],
        priorities: [
            {
                code: 1,
                label: "Minor"
            },
            {
                code: 2,
                label: "Normal"
            },
            {
                code: 3,
                label: "Major"
            },
            {
                code: 4,
                label: "Critical"
            },
            {
                code: 5,
                label: "Blocker"
            }
        ]
    };
    var AlertService = (function () {
        function AlertService($rootScope, $q) {
            this.$rootScope = $rootScope;
            this.$q = $q;
        }
        AlertService.prototype.generateSampleData = function () {
            for (var i = 0; i < 200; i++) {
                _data.push(new Alert(i, "Alert " + i, "John Snow", Math.floor((Math.random() * 4) + 1)));
            }
        };
        AlertService.prototype.all = function (page, itemsPerPage, filter) {
            var deferred = this.$q.defer();
            var result = _data;
            if (filter.priority.length > 0) {
                result = _data.filter(function (item) {
                    return filter.priority.indexOf(item.priority) > -1;
                });
            }
            result = result.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);
            deferred.resolve({
                content: result,
                totalElements: _data.length
            });
            return deferred.promise;
        };
        AlertService.prototype.get = function (id) {
            var deferred = this.$q.defer();
            var item;
            for (var _i = 0; _i < _data.length; _i++) {
                var item = _data[_i];
                if (item.id === parseInt(id)) {
                    deferred.resolve(item);
                }
            }
            return deferred.promise;
        };
        AlertService.prototype.update = function (alert) {
            var _this = this;
            return this.get(alert.id)
                .then(function (item) {
                angular.extend(item, alert);
                _this.$rootScope.$broadcast('$alerts:update', item);
            });
        };
        AlertService.prototype.add = function (alert) {
            var deferred = this.$q.defer();
            alert.id = Math.floor((Math.random() * 100000) + 1000);
            _data.push(alert);
            deferred.resolve(alert);
            this.$rootScope.$broadcast('$alerts:add', alert);
            return deferred.promise;
        };
        AlertService.prototype.dict = function (name) {
            if (name === void 0) { name = null; }
            if (name) {
                return _dict[name];
            }
            else {
                return _dict;
            }
        };
        return AlertService;
    })();
    return AlertService;
});
//# sourceMappingURL=AlertService.js.map