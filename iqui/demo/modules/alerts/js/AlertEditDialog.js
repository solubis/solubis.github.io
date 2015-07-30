/// <reference path="../../../types/types.d.ts" />
define(["require", "exports", './Alert'], function (require, exports, Alert) {
    var AlertEditDialog = (function () {
        function AlertEditDialog($dialog, $alerts) {
            this.$dialog = $dialog;
            this.$alerts = $alerts;
        }
        AlertEditDialog.prototype.open = function (alert) {
            return this.$dialog.open({
                templateUrl: 'modules/alerts/html/alert-edit.html',
                controller: 'AlertEditController as ctrl',
                backdrop: 'static',
                resolve: {
                    alert: function () { return (alert ? alert : new Alert()); }
                },
                size: 'lg'
            });
        };
        return AlertEditDialog;
    })();
    return AlertEditDialog;
});
//# sourceMappingURL=AlertEditDialog.js.map