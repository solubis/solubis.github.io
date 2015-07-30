/// <reference path="../../../types/types.d.ts" />
define(["require", "exports"], function (require, exports) {
    var AlertEditController = (function () {
        function AlertEditController($scope, $toast, $alerts, alert) {
            this.$scope = $scope;
            this.$toast = $toast;
            this.$alerts = $alerts;
            this.alert = alert;
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
                                children: [{ name: 'Jurek Błaszczyk', type: 'person' }]
                            },
                            { name: 'Piotrek', type: 'person' },
                            { name: 'Bartek', type: 'person' }
                        ]
                    },
                    { name: 'Kierownicy', type: 'group', children: [{ name: 'Radek', type: 'person' }] },
                    { name: 'Jan Kowalski', type: 'person' },
                    { name: 'Stefan Kizior', type: 'person' }
                ]
            };
        }
        AlertEditController.prototype.saveChanges = function () {
            var _this = this;
            var save;
            if (this.alert.id) {
                save = this.$alerts.update(this.alert);
            }
            else {
                save = this.$alerts.add(this.alert);
            }
            save
                .then(function () {
                _this.$scope.$close();
                _this.$toast.info('Alert {0} saved', _this.alert.id);
            })
                .catch(function (error) {
                _this.$toast.error('Error', JSON.stringify(error));
            });
        };
        return AlertEditController;
    })();
    return AlertEditController;
});
//# sourceMappingURL=AlertEditController.js.map