/// <reference path="../../types/types.d.ts" />

class MenuController {
    id:string;
    alert:any;
    foundAlertID;

    constructor($scope, private $alerts, private $alertDialog, private $aside) {
    }

    addAlert() {
        this.$alertDialog.open();
    }

    gotoAlertDetails(id) {
        if (id) {
            this.foundAlertID = '';

            this.$alerts
                .get(id)
                .then((alert)=> {
                    this.$alertDialog.open(alert);
                });
        }
    }
}

export var module = angular
    .module('modules.menu', [
        'modules.alerts'
    ])
    .controller('MenuController', MenuController);
