/// <reference path="../../../types/types.d.ts" />
define(["require", "exports"], function (require, exports) {
    var DEFAULT_PRIORITY_CODE = 1;
    var Alert = (function () {
        function Alert(id, name, assignee, priority, description) {
            if (id === void 0) { id = null; }
            if (name === void 0) { name = null; }
            if (assignee === void 0) { assignee = null; }
            if (priority === void 0) { priority = DEFAULT_PRIORITY_CODE; }
            if (description === void 0) { description = ""; }
            this.id = id;
            this.name = name;
            this.priority = priority;
            this.assignee = assignee;
            this.description = description;
            this.creationDate = new Date();
        }
        return Alert;
    })();
    return Alert;
});
//# sourceMappingURL=Alert.js.map