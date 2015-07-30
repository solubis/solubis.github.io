/// <reference path="../../../types/types.d.ts" />

import Alert = require('./Alert');
import AlertService = require('./AlertService');
import AlertEditDialog = require('./AlertEditDialog');

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

class AlertListController {

    tableParams:any;
    isLoading:boolean;
    data:Alert[];
    dict:any;
    filter:any;
    private sidebar;

    constructor(private $scope,
                private $state,
                private $alerts:AlertService,
                private $alertDialog:AlertEditDialog,
                private $dialog,
                private $toaster,
                private $sidebar,
                private ngTableParams) {

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
            getData: ($defer, params) => {
                var page = params.page() - 1;
                var count = params.count();
                var filter = params.filter();

                this.isLoading = true;

                _params.page = page + 1;
                _params.count = count;

                $alerts
                    .all(page, count, filter)
                    .then((result) => {
                        this.data = result.content;

                        _total = result.totalElements;

                        params.total(_total);

                        $defer.resolve(this.data);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        });

        this.sidebar = $sidebar.create({
            templateUrl: 'modules/menu/rightbar.html',
            resolve: {
                title: function(){
                    return 'Friends'
                }
            },
            controller: function($scope, title){
                this.tab1 = title;
                this.tab2 = 'Online';
            },
            controllerAs: 'ctrl',
            side: 'right'
        });

        $scope.$on('$alerts:update', (event, alert) => {
            this.data.forEach((item) => {
                if (item.id === alert.id) {
                    angular.extend(item, alert);
                }
            })
        });

        $scope.$on('$alerts:add', (event, alert)=> {
            this.data.unshift(alert);
        });
    }

    /*
     Update ngTable filter after selecting multi-select filter
     Save filter values in module variable _filter to persist it across different pages
     */

    updateTableFilter() {
        _params.filter.priority = this.filter.priority.map((item) => item.code);

        _filter = this.filter;

        this.tableParams.parameters(_params);
    }

    /*
     Restore selected filter values from _filter variable
     */

    restoreFilter() {

        function selectDictionaryValue(dictionary, code) {
            for (var i = 0; i < dictionary.length; i++) {
                if (dictionary[i].code === code) {
                    dictionary[i].selected = true;
                }
            }
        }

        angular.forEach(_filter.priority, (item) => {
            selectDictionaryValue(this.dict.priorities, item.code);
        });
    }

    deleteAlert() {
        this.$dialog
            .alert('Kasowanie alertu', 'Chcesz skasować Alert?', 'Tak', 'Nie')
            .then(function (result) {
                this.$toaster.info('Alert byłby skasowany');
            })
    }

    static alertSearchDirective($alerts):ng.IDirective {

        return {
            restrict: 'AE',
            replace: true,
            link: function (scope:any, element) {
                scope.find = (id) => {
                    return $alerts
                        .get(id)
                        .then((result) => {
                            return [result];
                        })
                        .catch(()=> {
                            return [];
                        });
                };
            },
            template: '<input type="text" placeholder="Podaj ID alertu..." typeahead="alert.id for alert in find($viewValue)" typeahead-template-url="modules/alerts/html/alert-found.html">'
        }
    }
}

export = AlertListController;
