---
layout: post
title:  "Syntax highlighter JavaScript"
date:   2014-02-08 20:18:48
description: "Syntax highliter test JavaScipt"
tag: "JavaScript"
color: "red"
author: "Jurek Błaszczyk"
---
By default, when the object changes AngularJS will check the object for equality by reference.
That means that if you modified a property within your object, or added an item to a watched array, it will not trigger.
The solution is to define the watch’s equality for value instead of reference, this is simply done by adding a boolean property to your watch call.

<script type="syntaxhighlighter" class="brush: html"><![CDATA[
<div ng-app="app">

<div ng-controller="MainCtrl">

<div ng-repeat="item in arr">{{item}}</div>

    Simple Watch:
    <div>{{count}}</div>

    Equality check Watch:
    <div>{{count2}}</div>

    <a ng-click="add()">add</a>

</div>
]]></script>

<script type="syntaxhighlighter" class="brush: javascript"><![CDATA[
function MainCtrl($scope){

    $scope.arr = [];
    $scope.count = 0;
    $scope.count2 = 0;

    $scope.add = function(){
        $scope.arr.push("test");
    }

    // This would not work, checks by reference
    $scope.$watch("arr", function(){
        $scope.count++;
    }, false);

    // This would work, check by value
    $scope.$watch("arr", function(){
        $scope.count2++;
    }, true);
}

angular.module('app', []).run(function () {});
]]></script>

Full JSFiddle:

<iframe width="100%" height="300" src="http://jsfiddle.net/yoorek/CN25c/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>