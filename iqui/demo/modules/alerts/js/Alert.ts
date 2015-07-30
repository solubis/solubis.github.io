/// <reference path="../../../types/types.d.ts" />

var DEFAULT_PRIORITY_CODE = 1;

class Alert {

    id:number;
    name:string;
    priority:number;
    assignee:string;
    description:string;
    testMode: boolean;
    creationDate:Date;

    constructor(id:number = null, name:string = null, assignee:string = null, priority:number = DEFAULT_PRIORITY_CODE, description:string = "") {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.assignee = assignee;
        this.description = description;
        this.creationDate = new Date();
    }
}

export = Alert;
