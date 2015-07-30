/// <reference path="../../types/types.d.ts" />
define(["require", "exports"], function (require, exports) {
    var MenuController = (function () {
        function MenuController($scope, $alerts, $alertDialog, $aside) {
            this.$alerts = $alerts;
            this.$alertDialog = $alertDialog;
            this.$aside = $aside;
        }
        MenuController.prototype.addAlert = function () {
            this.$alertDialog.open();
        };
        MenuController.prototype.gotoAlertDetails = function (id) {
            var _this = this;
            if (id) {
                this.foundAlertID = '';
                this.$alerts
                    .get(id)
                    .then(function (alert) {
                    _this.$alertDialog.open(alert);
                });
            }
        };
        return MenuController;
    })();
    exports.module = angular
        .module('modules.menu', [
        'modules.alerts'
    ])
        .controller('MenuController', MenuController);
});
//# sourceMappingURL=menu.js.map