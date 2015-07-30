/// <reference path="../../../types/types.d.ts" />

import Alert = require('./Alert');
import AlertService = require('./AlertService');

class AlertEditDialog {

    constructor(private $dialog, private $alerts:AlertService) {
    }

    open(alert:Alert) {
        return this.$dialog.open({
            templateUrl: 'modules/alerts/html/alert-edit.html',
            controller: 'AlertEditController as ctrl',
            backdrop: 'static',
            resolve: {
                alert: () => (alert ? alert : new Alert())
            },
            size: 'lg'
        })
    }
}

export = AlertEditDialog;
