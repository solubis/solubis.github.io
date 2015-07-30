/// <reference path="../../../types/types.d.ts" />
define(["require", "exports"], function (require, exports) {
    var _total = 0;
    var _filter;
    /*
     Params for ngTable and filter - module variables that can be persisted in memory across loaded pages
     */
    var _params = {
        page: 1,
        count: 10,
        sorting: {
            id: 'desc'
        },
        filter: {
            priority: []
        }
    };
    var AlertListController = (function () {
        function AlertListController($scope, $state, $alerts, $alertDialog, $dialog, $toaster, $sidebar, ngTableParams) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$alerts = $alerts;
            this.$alertDialog = $alertDialog;
            this.$dialog = $dialog;
            this.$toaster = $toaster;
            this.$sidebar = $sidebar;
            this.ngTableParams = ngTableParams;
            this.dict = $alerts.dict();
            /*
             Default filter for multi-select
             */
            this.filter = {
                priority: []
            };
            /*
             ngTable options
             */
            this.tableParams = new ngTableParams(_params, {
                total: _total,
                counts: [10, 25, 100],
                filterDelay: 0,
                getData: function ($defer, params) {
                    var page = params.page() - 1;
                    var count = params.count();
                    var filter = params.filter();
                    _this.isLoading = true;
                    _params.page = page + 1;
                    _params.count = count;
                    $alerts
                        .all(page, count, filter)
                        .then(function (result) {
                        _this.data = result.content;
                        _total = result.totalElements;
                        params.total(_total);
                        $defer.resolve(_this.data);
                    })
                        .finally(function () {
                        _this.isLoading = false;
                    });
                }
            });
            this.sidebar = $sidebar.create({
                templateUrl: 'modules/menu/rightbar.html',
                resolve: {
                    title: function () {
                        return 'Friends';
                    }
                },
                controller: function ($scope, title) {
                    this.tab1 = title;
                    this.tab2 = 'Online';
                },
                controllerAs: 'ctrl',
                side: 'right'
            });
            $scope.$on('$alerts:update', function (event, alert) {
                _this.data.forEach(function (item) {
                    if (item.id === alert.id) {
                        angular.extend(item, alert);
                    }
                });
            });
            $scope.$on('$alerts:add', function (event, alert) {
                _this.data.unshift(alert);
            });
        }
        /*
         Update ngTable filter after selecting multi-select filter
         Save filter values in module variable _filter to persist it across different pages
         */
        AlertListController.prototype.updateTableFilter = function () {
            _params.filter.priority = this.filter.priority.map(function (item) { return item.code; });
            _filter = this.filter;
            this.tableParams.parameters(_params);
        };
        /*
         Restore selected filter values from _filter variable
         */
        AlertListController.prototype.restoreFilter = function () {
            var _this = this;
            function selectDictionaryValue(dictionary, code) {
                for (var i = 0; i < dictionary.length; i++) {
                    if (dictionary[i].code === code) {
                        dictionary[i].selected = true;
                    }
                }
            }
            angular.forEach(_filter.priority, function (item) {
                selectDictionaryValue(_this.dict.priorities, item.code);
            });
        };
        AlertListController.prototype.deleteAlert = function () {
            this.$dialog
                .alert('Kasowanie alertu', 'Chcesz skasować Alert?', 'Tak', 'Nie')
                .then(function (result) {
                this.$toaster.info('Alert byłby skasowany');
            });
        };
        AlertListController.alertSearchDirective = function ($alerts) {
            return {
                restrict: 'AE',
                replace: true,
                link: function (scope, element) {
                    scope.find = function (id) {
                        return $alerts
                            .get(id)
                            .then(function (result) {
                            return [result];
                        })
                            .catch(function () {
                            return [];
                        });
                    };
                },
                template: '<input type="text" placeholder="Podaj ID alertu..." typeahead="alert.id for alert in find($viewValue)" typeahead-template-url="modules/alerts/html/alert-found.html">'
            };
        };
        return AlertListController;
    })();
    return AlertListController;
});
//# sourceMappingURL=AlertListController.js.map