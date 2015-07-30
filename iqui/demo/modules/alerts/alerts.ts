/// <reference path="../../types/types.d.ts" />

import AlertService = require('./js/AlertService');
import AlertListController = require('./js/AlertListController');
import AlertEditController = require('./js/AlertEditController');
import AlertEditDialog = require('./js/AlertEditDialog');

export var module = angular
    .module('modules.alerts', [
        'modules.alerts',
        'ngTable'
    ])
    .config(($stateProvider) => {
        $stateProvider
            .state('alerts', {
                url: '/alerts/list/:page',
                templateUrl: 'modules/alerts/html/alerts.html',
                controller: 'AlertListController as ctrl'
            })

            .state('view', {
                url: '/alerts/view/:id',
                templateUrl: 'modules/alerts/html/alert-view.html',
                controller: 'AlertViewController as ctrl',
                resolve: {
                    alert: ($stateParams, $alerts) => $alerts.get($stateParams.id)
                }
            });
    })
    .controller('AlertListController', AlertListController)
    .controller('AlertEditController', AlertEditController)
    .service('$alerts', AlertService)
    .service('$alertDialog', AlertEditDialog)
    .directive('alertSearch', AlertListController.alertSearchDirective);
