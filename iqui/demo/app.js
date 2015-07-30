/// <reference path="types/types.d.ts" />
define(["require", "exports", 'modules/alerts/alerts', 'modules/menu/menu'], function (require, exports, alerts, menu) {
    angular
        .module('app', [
        'iq.ui',
        alerts.module.name,
        menu.module.name
    ])
        .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
        /**
         UI Router bug workaround for:
         https://github.com/angular-ui/ui-router/issues/600
         */
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('alerts');
        });
        $translateProvider.language('pl');
    })
        .run(function ($rootScope, $alerts, $toast, $timeout, $commonVersion, $log, $format) {
        $rootScope.multiSelectLabels = {
            selectAll: 'Wszystkie',
            selectNone: 'Resetuj',
            reset: 'Zresetuj',
            search: 'Wpisz żeby szukać...',
            nothingSelected: 'Wszystkie'
        };
        $rootScope.$version = $commonVersion + ' [angular.' + angular.version.full + ']';
        $alerts.generateSampleData();
        $rootScope.testDate = new Date(2015, 4, 22, 4, 57, 0, 0);
        $rootScope.testTimestamp = 1429678641.837;
        $rootScope.testTimestamp = 1434908016;
        $timeout(function () { return $toast.info('Welcome Back {0}', 'User'); });
        $log.debug($format('System started {0}', new Date()));
    })
        .value('$dateFormat', 'yyyy-MM-dd HH:mm:ss')
        .filter('dateFormat', function ($filter, $dateFormat) {
        return function (value) {
            return $filter('date')(value, $dateFormat);
        };
    })
        .filter('priority', function ($alerts) {
        return function (value) {
            return $alerts.dict('priorities')[value].label;
        };
    });
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app'], {});
    });
});
//# sourceMappingURL=app.js.map