/// <reference path="../../types/types.d.ts" />
define(["require", "exports", './js/AlertService', './js/AlertListController', './js/AlertEditController', './js/AlertEditDialog'], function (require, exports, AlertService, AlertListController, AlertEditController, AlertEditDialog) {
    exports.module = angular
        .module('modules.alerts', [
        'modules.alerts',
        'ngTable'
    ])
        .config(function ($stateProvider) {
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
                alert: function ($stateParams, $alerts) { return $alerts.get($stateParams.id); }
            }
        });
    })
        .controller('AlertListController', AlertListController)
        .controller('AlertEditController', AlertEditController)
        .service('$alerts', AlertService)
        .service('$alertDialog', AlertEditDialog)
        .directive('alertSearch', AlertListController.alertSearchDirective);
});
//# sourceMappingURL=alerts.js.map