/// <reference path="../../../types/types.d.ts" />

import Alert = require('./Alert');

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

class AlertService {

    constructor(private $rootScope, private $q) {
    }

    generateSampleData() {
        for (var i = 0; i < 200; i++) {
            _data.push(new Alert(i, "Alert " + i, "John Snow", Math.floor((Math.random() * 4) + 1)));
        }
    }

    all(page, itemsPerPage, filter) {
        var deferred = this.$q.defer();
        var result = _data;

        if (filter.priority.length > 0) {
            result = _data.filter((item) => {
                return filter.priority.indexOf(item.priority) > -1;
            });
        }

        result = result.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

        deferred.resolve({
            content: result,
            totalElements: _data.length
        });

        return deferred.promise;
    }

    get(id:string) {
        var deferred = this.$q.defer();
        var item;

        for (var item of _data) {
            if (item.id === parseInt(id)) {
                deferred.resolve(item);
            }
        }

        return deferred.promise;
    }

    update(alert) {
        return this.get(alert.id)
            .then((item) => {
                angular.extend(item, alert);
                this.$rootScope.$broadcast('$alerts:update', item);
            });
    }

    add(alert) {
        var deferred = this.$q.defer();

        alert.id = Math.floor((Math.random() * 100000) + 1000);

        _data.push(alert);

        deferred.resolve(alert);

        this.$rootScope.$broadcast('$alerts:add', alert);

        return deferred.promise;
    }

    dict(name = null) {
        if (name) {
            return _dict[name];
        } else {
            return _dict;
        }
    }

}

export = AlertService;
