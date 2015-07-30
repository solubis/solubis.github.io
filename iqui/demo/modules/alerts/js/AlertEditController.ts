/// <reference path="../../../types/types.d.ts" />

import Alert = require('./Alert');
import AlertService = require('./AlertService');

class AlertEditController {

    dict:any;
    private testDate;
    private structure;

    constructor(private $scope, private $toast, private $alerts, private alert) {
        this.dict = $alerts.dict();
        this.testDate = new Date();

        this.structure = {
            name: 'Impaq',
            type: 'group',
            children: [
                {
                    name: 'Programiści', type: 'group',
                    children: [
                        {
                            name: 'Javascript', type: 'group',
                            children: [{name: 'Jurek Błaszczyk', type: 'person'}]
                        },
                        {name: 'Piotrek', type: 'person'},
                        {name: 'Bartek', type: 'person'}
                    ]
                },
                {name: 'Kierownicy', type: 'group', children: [{name: 'Radek', type: 'person'}]},
                {name: 'Jan Kowalski', type: 'person'},
                {name: 'Stefan Kizior', type: 'person'}
            ]
        };
    }

    saveChanges() {
        var save;

        if (this.alert.id) {
            save = this.$alerts.update(this.alert);
        } else {
            save = this.$alerts.add(this.alert);
        }

        save
            .then(() => {
                this.$scope.$close();
                this.$toast.info('Alert {0} saved', this.alert.id);
            })
            .catch((error) => {
                this.$toast.error('Error', JSON.stringify(error));
            });
    }
}

export = AlertEditController;
