---
layout: post
title:  "PouchDB promises and Angular"
date:   2014-05-16 20:18:48
description: "PouchDB version 2 introduces promises. Working with Angular however it's better to use native Angular promises. Here is why and how integrate these libraries together"
tag: "Angular"
color: "red"
author: "Jurek Błaszczyk"
---

PouchDB is library that gives you CouchDB server API in client browser. It is very convinient layer that separates you from different browser datastores
(WebSQL, IndexedDB, LocalStorage). It also can sync local data with CouchDB server.
Latest version introduced Promises so, instead of:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
var db = new PouchDB('test');

db.allDocs(function(error, result){
	// do something with collection
	if (error) {
		throw new Error('Something went wrong')
	}

	db.post({name:'name'}, fucntion(error, result){
		if (error) {
			throw new Error('Something went wrong')
		}
		// do something with result
	})
})

]]></script>

you can use clear syntax and error handling of promises:


<script type="syntaxhighlighter" class="brush: js"><![CDATA[
var db = new PouchDB('test');

db.allDocs()
	.then(function(result){
		// do something with collection
		return db.post({name:'name'});
	})
	.then(function(result){
		// do something with result
	})
	.catch(function(error){
		return throw new Error('Something went wrong');
	})
})

]]></script>

It is a good idea to contain all database logic in Angular's service so we prepare one for this purpose.
Let's make service methods just for reading collectio, creating and deleting elements:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
app.factory('Database', function ($q) {
    var _db,
    _databaseName;

    var Database = function (databaseName) {
        _databaseName = databaseName;
        _db = new PouchDB(_databaseName);
    };

    Database.prototype.all = function () {
        var options = {
            include_docs: true
        };

        return _db.allDocs(options)
            .then(function (result) {
            var converted;

            converted = result.rows.map(function (element) {
                return element.doc;
            });

            return converted;
        });
    };

    Database.prototype.create = function (record) {
        return _db.post(record)
            .then(function (result) {
            return _db.get(result.id);
        });
    };

    Database.prototype.remove = function (record) {
        return _db.remove(record);
    };

    return Database;
});
]]></script>

We can use this service in controller:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
app.controller('AppController', function ($scope, Database) {
    var db = new Database('test');

    $scope.init = function () {
        db.all()
            .then(function (result) {
                $scope.data = result;
            }
        });
    };
});

]]></script>

The problem is when this run ... nothing happens. I mean $scope.data is empty until next $digest cycle.
That's because PouchDB promises resolution is outside Angular digest cycle.
If we want to have immediate results we have to run $digest by hand which means use $scope.$apply function:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
app.controller('AppController', function ($scope, Database) {
    var db = new Database('test');

    $scope.init = function () {
        db.all()
            .then(function (result) {
            $scope.$apply(function () {
                $scope.data = result;
            })
        });
    };
});

]]></script>

Here is full [JSFiddle with sample for this](http://jsfiddle.net/yoorek/2zt27/)

So, each time we use our Database service we have to remember to run $apply.
We could move $apply to 'then' clauses in our Database service, but there is one thing we can do to make things easier.
We can package PouchDB calls in native Angular $q promises.
For each PouchDB call we surround it with $q.when to convert it to Angular promise.
First, we are compatible with Angular @q promies, Second, when 'then' is called it is already wrapped by Angular in 'apply'.
Here is how it works:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
Database.prototype.all = function () {
        var options = {
            include_docs: true
        };

        return $q.when(_db.allDocs(options))
            .then(function (result) {
            var converted;

            converted = result.rows.map(function (element) {
                return element.doc;
            });

            return converted;
        });
    };

]]></script>

After that we don't have to call $apply in our controllers:

<script type="syntaxhighlighter" class="brush: js"><![CDATA[
    $scope.init = function () {
        db.all()
            .then(function (result) { 
                $scope.data = result; 
        });
    };
]]></script>

And our code is clearer, simpler and less error prone.

Here is [JSFiddle version for that](http://jsfiddle.net/yoorek/2zt27/1/)


